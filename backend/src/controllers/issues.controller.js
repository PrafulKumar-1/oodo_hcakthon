const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Creates a new civic issue. The user must be authenticated.
 * @param {object} req - The Express request object. Expects { title, description, category, latitude, longitude } in req.body.
 * @param {object} res - The Express response object.
 */
const createIssue = async (req, res) => {
  const { title, description, category, latitude, longitude } = req.body;

  if (!title || !description || !category || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: 'All fields including latitude and longitude are required.' });
  }

  try {
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        category,
        latitude,
        longitude,
        reporterId: req.user.id, // The user ID comes from the 'protect' middleware
      },
    });
    res.status(201).json(issue);
  } catch (error) {
    console.error('Create Issue Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Fetches civic issues within a specified radius from a user's location.
 * Uses a raw PostGIS query for efficient geospatial filtering.
 * @param {object} req - The Express request object. Expects { lat, lon, radius } as query parameters.
 * @param {object} res - The Express response object.
 */
const getIssuesWithinRadius = async (req, res) => {
  // Extract latitude, longitude, and radius from query parameters
  const { lat, lon, radius = 5 } = req.query; // Default radius to 5km if not provided

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude (lat) and longitude (lon) query parameters are required.' });
  }

  // Convert query parameters to numbers
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const searchRadius = parseFloat(radius) * 1000; // Convert radius from km to meters

  if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
    return res.status(400).json({ message: 'Invalid location or radius parameters.' });
  }

  try {
    // This raw SQL query uses PostGIS's ST_DWithin function to find all issues
    // within the specified distance (in meters) from the user's coordinates.
    // Using parameterized queries ($1, $2, $3) is crucial for preventing SQL injection.
    const issues = await prisma.$queryRaw`
      SELECT
        i.id,
        i.title,
        i.description,
        i.category,
        i.status,
        i.latitude,
        i.longitude,
        i."createdAt",
        json_build_object('name', u.name) as reporter
      FROM "Issue" as i
      JOIN "User" as u ON i."reporterId" = u.id
      WHERE ST_DWithin(
        ST_MakePoint(i.longitude, i.latitude)::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography,
        ${searchRadius}
      )
      ORDER BY i."createdAt" DESC;
    `;

    res.status(200).json(issues);
  } catch (error) {
    console.error('Get Issues by Radius Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  createIssue,
  getIssues: getIssuesWithinRadius, // We are now exporting the new geo-enabled function
};
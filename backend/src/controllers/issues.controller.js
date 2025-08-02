const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Creates a new civic issue. The user must be authenticated.
 * @param {object} req - The Express request object.
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
        reporterId: req.user.id,
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
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getIssuesWithinRadius = async (req, res) => {
  const { lat, lon, radius = 5 } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude (lat) and longitude (lon) query parameters are required.' });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const searchRadius = parseFloat(radius) * 1000;

  if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
    return res.status(400).json({ message: 'Invalid location or radius parameters.' });
  }

  try {
    const issues = await prisma.$queryRaw`
      SELECT
        i.id, i.title, i.description, i.category, i.status, i.latitude, i.longitude, i."createdAt",
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

/**
 * Updates the status of a specific issue. Requires admin privileges.
 * @param {object} req - The Express request object. Expects issue ID in params and { status } in body.
 * @param {object} res - The Express response object.
 */
const updateIssueStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate that the provided status is one of the allowed enum values
  if (!['REPORTED', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const updatedIssue = await prisma.issue.update({
      where: { id: id },
      data: { status: status },
    });
    res.status(200).json(updatedIssue);
  } catch (error) {
    console.error('Update Issue Status Error:', error);
    // Handle cases where the issue might not be found
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Issue not found.' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  createIssue,
  getIssues: getIssuesWithinRadius,
  updateIssueStatus, // <-- Export the new function
};

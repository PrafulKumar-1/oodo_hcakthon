const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Creates a new civic issue. Requires user to be authenticated.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const createIssue = async (req, res) => {
  const { title, description, category, latitude, longitude } = req.body;

  if (!title || !description || !category || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        category,
        latitude,
        longitude,
        reporterId: req.user.id, // User ID is available from the 'protect' middleware
      },
    });
    res.status(201).json(issue);
  } catch (error) {
    console.error('Create Issue Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Fetches all civic issues.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getIssues = async (req, res) => {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        reporter: {
          select: { name: true, email: true }, // Include some reporter info
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(issues);
  } catch (error) {
    console.error('Get Issues Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createIssue,
  getIssues,
};

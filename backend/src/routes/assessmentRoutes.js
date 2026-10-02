import { Router } from 'express';

const router = Router();

// Day 15 will replace this placeholder with assessment persistence APIs.
router.get('/', (_req, res) => {
  res.json({
    data: [],
    message: 'Assessment API persistence is planned for Day 15.',
  });
});

export default router;

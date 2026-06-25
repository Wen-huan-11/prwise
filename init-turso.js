const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://prwise-db-wen-huan-11.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODIzOTE4MzgsImlkIjoiMDE5ZWZlYzYtODUwMS03YWI2LThiZTItZWUyYjFmN2VlZWFhIiwicmlkIjoiNTBkZGU2NmUtNGE0ZS00ZDI4LWJmOTUtZjAyODAyN2I5MzBjIn0.oFRrqYQYJQ-p1Ze6LXFPjI8OfyXCYGCxAxHPHJb0nYzBr8T3Vfj1nddSXrahGSSnWII-jHXET15glmKb2orOAw',
});

const statements = [
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "githubId" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "avatarUrl" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "reviewsUsed" INTEGER NOT NULL DEFAULT 0,
    "reviewsLimit" INTEGER NOT NULL DEFAULT 50,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS "Repository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "githubId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Repository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prNumber" INTEGER NOT NULL,
    "prTitle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "diffUrl" TEXT,
    "qualityScore" INTEGER,
    "findingsCount" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "repositoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Review_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS "Finding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "filePath" TEXT,
    "lineStart" INTEGER,
    "lineEnd" INTEGER,
    "suggestion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewId" TEXT NOT NULL,
    CONSTRAINT "Finding_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  );`,
  `CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");`,
  `CREATE UNIQUE INDEX "Repository_githubId_key" ON "Repository"("githubId");`,
];

async function init() {
  for (const sql of statements) {
    try {
      await client.execute(sql);
      console.log('OK:', sql.slice(0, 50) + '...');
    } catch (err) {
      console.error('FAIL:', sql.slice(0, 50) + '...');
      console.error(err.message);
      process.exit(1);
    }
  }
  console.log('\nAll tables created successfully!');
  process.exit(0);
}

init();

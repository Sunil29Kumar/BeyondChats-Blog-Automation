# BeyondChats – Full Stack Web Developer Intern Assignment
## Project Overview

### This project is developed as part of the BeyondChats Full Stack Web Developer Intern Assignment.
### It is divided into two phases:

 **Phase 1: Scraping and storing the oldest articles from BeyondChats Blogs**

**Phase 2: Automated enhancement of articles using search engine references and an LLM**

**The project demonstrates web scraping, backend automation, API design, and AI-assisted content generation.**

## Tech Stack

**Frontend: React.js, Tailwind CSS**

**Backend: Node.js, Express.js**

**Database: MongoDB (Mongoose)**

**Web Scraping: Puppeteer**

**AI Integration: LLM API (for content enhancement)**


## Phase 1: Article Scraping & CRUD APIs

### Objective

**Fetch the oldest articles from BeyondChats blogs and store their metadata in a database, along with building CRUD APIs for future automation.**

### Phase 1 Workflow

**User clicks “Fetch Oldest Articles” button on frontend**

**Frontend triggers backend scraping API**

|**Backend:**|
-----------

**Uses Puppeteer to open https://beyondchats.com/blogs**

**Detects total pagination dynamically**

**Navigates to the last page**

**Extracts metadata of the oldest 5 articles**

**Extracted data is stored in MongoDB**

**CRUD APIs are exposed for internal use**

|**Data Stored**|
----------------

**Article title**

**URL**

**Excerpt**

**Author**

**Created date**

**Status (pending)**

**Version (original)**


## APIs Implemented (Phase 1)


| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST   | /api/scrape | Scrape & store oldest articles |
| GET    | /api/articles | Fetch all articles |
| GET    | /api/articles/:id | Fetch single article |
| PUT    | /api/articles/:id | Update article (for Phase 2) |
| DELETE | /api/articles/:id | Delete article (admin/testing) |

**⚠️ Update and Delete APIs are not exposed via UI and are intended for backend automation and internal use only.**


**Phase 1 Status**

✔ Completed
✔ Fully functional
✔ Backend automation ready

## Phase 2: Automated Article Enhancement (Advanced)
**Objective**

**Enhance original articles by analyzing top-ranking articles from search engines and rewriting the content using an LLM.**

### Phase 2 Workflow

**A Node.js automation script / internal API fetches a pending article from the database**

**The script searches the article title on a search engine (Google intent preserved)**

**Fetches the top 2 ranking blog/article links from other websites**

**Scrapes the main content from those reference articles**

**Sends:**

**Original article content**

**Reference article contentsto an LLM API**

**LLM generates an improved, well-formatted article**

**The enhanced article is published using existing CRUD APIs**

**Reference URLs are cited at the bottom of the new article**

**Original article is marked as enhanced**

### Enhanced Article Structure

**Improved title & content**

**Version: updated**

**Parent article reference**

**References (source URLs)**

**Updated timestamp**

**Original articles remain untouched for traceability.**

### Phase 2 API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST   | /api/articles/enhance | Automatically enhance one pending article |

**This endpoint is not connected to the frontend and is triggered via scripts or API clients (Postman).**

### Search Engine Note

**Due to automated access restrictions on Google Search, the system follows a best-effort approach:**

**Attempts Google Search via Puppeteer**

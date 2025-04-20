CREATE INDEX "search_index" ON "PublicGraph" USING GIN (to_tsvector('english', "title" || ' ' || "description"));


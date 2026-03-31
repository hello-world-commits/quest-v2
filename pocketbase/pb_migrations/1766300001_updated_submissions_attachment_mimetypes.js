/// <reference path="../pb_data/types.d.ts" />

// Remove the mimeTypes restriction from the attachment field entirely.
// PocketBase still enforces maxSize (100 MB) and maxSelect (10 files).
// Leaving mimeTypes as [] means PocketBase accepts any file content, which
// avoids rejecting valid images/videos whose MIME type is not in a hardcoded
// list (e.g. HEIC from iPhones, AVIF, TIFF, 3GP, etc.).
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2516444177");

    collection.fields.addAt(
      4,
      new Field({
        hidden: false,
        id: "file1542800728",
        maxSelect: 10,
        maxSize: 100000000,
        mimeTypes: [],
        name: "attachment",
        presentable: false,
        protected: false,
        required: false,
        system: false,
        thumbs: [],
        type: "file",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    // Revert to the list that was in place before this migration.
    const collection = app.findCollectionByNameOrId("pbc_2516444177");

    collection.fields.addAt(
      4,
      new Field({
        hidden: false,
        id: "file1542800728",
        maxSelect: 10,
        maxSize: 100000000,
        mimeTypes: [
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "image/gif",
          "image/webp",
          "video/quicktime",
          "video/mp4",
          "video/webm",
          "video/x-msvideo",
          "video/x-matroska",
          "video/x-flv",
          "video/mpeg",
        ],
        name: "attachment",
        presentable: false,
        protected: false,
        required: false,
        system: false,
        thumbs: [],
        type: "file",
      }),
    );

    return app.save(collection);
  },
);

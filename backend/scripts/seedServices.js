const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const Service = require('../models/Service');

// Load environment variables
const localEnvPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
} else {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

const cleanTitle = (filename) => {
  let name = filename.replace(/\.[^/.]+$/, ""); // Remove extension
  name = name.replace(/\d+$/, ""); // Remove trailing numbers
  name = name.trim();
  name = name.replace(/[_-]/g, " ");
  return name.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
};

// Helper to sanitize Cloudinary folder path (remove spaces, ampersands, and brackets)
const sanitizeCloudinaryFolder = (folderPath) => {
  return folderPath
    .replace(/[^a-zA-Z0-9_\/]/g, '_')
    .replace(/__+/g, '_');
};

// Helper to upload image to Cloudinary
const uploadToCloudinary = (filePath, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { folder: sanitizeCloudinaryFolder(folder) }, (error, result) => {
      if (error) {
        console.error(`Cloudinary upload failed for ${filePath}:`, error.message);
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    });
  });
};

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully!');

    // Wipe existing services
    console.log('Wiping existing services...');
    await Service.deleteMany({});
    console.log('Existing services cleared.');

    const publicDir = path.join(__dirname, '..', '..', 'frontend', 'public');
    if (!fs.existsSync(publicDir)) {
      throw new Error(`Public directory not found at ${publicDir}`);
    }

    // Map parent categories and their folders in frontend/public
    const parentCategories = [
      { title: 'Interiors', folderName: 'Interiors' },
      { title: 'Exterior & Landscaping', folderName: 'Exterrior & Landscaping' },
      { title: 'Swimming Pools & Fountains', folderName: 'Swimming pools &Fountains' },
      { title: 'Play Station', folderName: 'Play Station' },
      { title: 'Construction', folderName: 'Construction' }
    ];

    for (const parent of parentCategories) {
      console.log(`\n--------------------------------------------`);
      console.log(`Processing Parent Category: ${parent.title}`);
      console.log(`--------------------------------------------`);

      const parentPath = path.join(publicDir, parent.folderName);
      if (!fs.existsSync(parentPath)) {
        console.warn(`Folder not found for parent category: ${parent.title} at ${parentPath}. Skipping.`);
        continue;
      }

      // 1. Scan contents of parent folder
      const contents = fs.readdirSync(parentPath);
      const subdirs = contents.filter(name => fs.statSync(path.join(parentPath, name)).isDirectory());
      const parentFiles = contents.filter(name => !fs.statSync(path.join(parentPath, name)).isDirectory());

      let parentCoverImageUrl = '';
      const childrenData = [];

      // Check if parent has subdirectories
      if (subdirs.length > 0) {
        // Parent has children folders
        for (const childDir of subdirs) {
          console.log(`  Processing Child Category: ${childDir}`);
          const childPath = path.join(parentPath, childDir);
          const childFiles = fs.readdirSync(childPath);

          // Get image files
          const imageFiles = childFiles.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return SUPPORTED_EXTENSIONS.includes(ext);
          });

          if (imageFiles.length === 0) {
            console.log(`    No images found in ${childDir}. Skipping.`);
            continue;
          }

          // Search for cover image
          const coverFile = imageFiles.find(file => {
            const base = path.basename(file, path.extname(file)).toLowerCase();
            return base === 'cover';
          });

          let childCoverUrl = '';
          const galleryData = [];

          // Upload all gallery images first
          for (const imageFile of imageFiles) {
            const imagePath = path.join(childPath, imageFile);
            const isCover = imageFile === coverFile;
            
            console.log(`    Uploading gallery image: ${imageFile}...`);
            try {
              const uploadedUrl = await uploadToCloudinary(imagePath, `prosper_design/services/${parent.folderName}/${childDir}`);
              
              // Only add to gallery if it's not the standalone cover image, or keep it in gallery anyway
              galleryData.push({
                url: uploadedUrl,
                caption: cleanTitle(imageFile),
                description: `Premium design execution of ${cleanTitle(imageFile)} under ${childDir}.`
              });

              if (isCover) {
                childCoverUrl = uploadedUrl;
              }
            } catch (err) {
              console.error(`    Failed to upload ${imageFile}:`, err.message);
            }
          }

          // If no specific cover photo was uploaded, set the first uploaded gallery image as cover photo
          if (!childCoverUrl && galleryData.length > 0) {
            childCoverUrl = galleryData[0].url;
            console.log(`    No specific cover photo. Set first image as cover: ${galleryData[0].caption}`);
          }

          childrenData.push({
            title: childDir,
            coverImage: childCoverUrl,
            description: `Bespoke and luxury ${childDir.toLowerCase()} designs custom crafted for your spaces.`,
            features: ['Premium Quality', 'Custom Materials', 'Expert Workmanship'],
            gallery: galleryData
          });
        }
      } else {
        // Parent folder has no subfolders, treat images directly inside it as a single child category
        console.log(`  No subfolders found. Creating default child category for: ${parent.title}`);
        
        const imageFiles = parentFiles.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return SUPPORTED_EXTENSIONS.includes(ext);
        });

        if (imageFiles.length > 0) {
          const galleryData = [];
          for (const imageFile of imageFiles) {
            const imagePath = path.join(parentPath, imageFile);
            console.log(`    Uploading image to default category: ${imageFile}...`);
            try {
              const uploadedUrl = await uploadToCloudinary(imagePath, `prosper_design/services/${parent.folderName}`);
              galleryData.push({
                url: uploadedUrl,
                caption: cleanTitle(imageFile),
                description: `Bespoke and professional ${cleanTitle(imageFile)} design.`
              });
            } catch (err) {
              console.error(`    Failed to upload ${imageFile}:`, err.message);
            }
          }

          childrenData.push({
            title: `${parent.title} Projects`,
            coverImage: galleryData[0]?.url || '',
            description: `Luxury custom ${parent.title.toLowerCase()} service execution by Prosper Design.`,
            features: ['Premium Build', 'Luxury Finishes', 'Structural Warranty'],
            gallery: galleryData
          });
        }
      }

      // Check for parent category cover image in the parent folder
      const parentCoverFile = parentFiles.find(file => {
        const ext = path.extname(file).toLowerCase();
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          const base = path.basename(file, ext).toLowerCase();
          return base === 'cover';
        }
        return false;
      });

      if (parentCoverFile) {
        console.log(`  Uploading Parent Cover: ${parentCoverFile}...`);
        try {
          parentCoverImageUrl = await uploadToCloudinary(path.join(parentPath, parentCoverFile), `prosper_design/services/${parent.folderName}`);
        } catch (err) {
          console.error(`  Parent cover upload failed:`, err.message);
        }
      }

      // If no parent cover photo exists, set parent cover photo to the first child's cover image
      if (!parentCoverImageUrl && childrenData.length > 0) {
        parentCoverImageUrl = childrenData[0].coverImage;
        console.log(`  No specific parent cover. Using first child cover: ${childrenData[0].title}`);
      }

      // Save parent category to Database
      const newService = new Service({
        title: parent.title,
        coverImage: parentCoverImageUrl,
        children: childrenData
      });

      await newService.save();
      console.log(`Saved parent category ${parent.title} to database with ${childrenData.length} child services!`);
    }

    console.log('\nSeeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();

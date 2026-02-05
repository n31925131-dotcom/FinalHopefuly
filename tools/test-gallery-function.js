#!/usr/bin/env node
/**
 * Test script for the Netlify Gallery Function
 * Usage: node tools/test-gallery-function.js [URL]
 * Default URL: http://localhost:8888/.netlify/functions/gallery (Netlify Dev)
 */

const DEFAULT_URL = 'http://localhost:8888/.netlify/functions/gallery';

async function testGalleryAPI(url) {
  console.log(`Testing Netlify gallery function at: ${url}\n`);

  try {
    const startTime = Date.now();
    const response = await fetch(url);
    const duration = Date.now() - startTime;

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response time: ${duration}ms\n`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', errorData);
      process.exit(1);
    }

    const data = await response.json();

    if (!data.categories || typeof data.categories !== 'object') {
      console.error('Invalid response: missing "categories" object');
      process.exit(1);
    }

    console.log('Categories found:', Object.keys(data.categories).length);
    console.log('---');

    let totalImages = 0;
    for (const [categoryName, images] of Object.entries(data.categories)) {
      console.log(`\nCategory: ${categoryName} (${images.length} images)`);
      for (const image of images) {
        if (!image.url || !image.name || !image.id) {
          console.error(`  ERROR: Image ${image.name || 'unknown'} missing fields`);
          continue;
        }
        console.log(`  - ${image.name}`);
        totalImages++;
      }
    }

    console.log('\n---');
    console.log(`Total images: ${totalImages}`);
    console.log('Test completed successfully!');

  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

const url = process.argv[2] || DEFAULT_URL;
testGalleryAPI(url);

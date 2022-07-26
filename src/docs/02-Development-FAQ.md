---
title: Development FAQ
---


## 1. How does the Design System work?
This Design System is created using Fractal: https://fractal.build/

Fractal is a tool to help you build and document web component libraries, and then integrate them into your projects.

**It is strongly recommended to read and understand Fractal documentation before using this Design System.**


## 2. How to develop frontend locally?
1. `npm install` - Install all project dependencies
2. `gulp dev` - Launch development server
Only make changes to files in **src** folder. Read below what are **src**, **tmp** and **www** folders.

## 3. How to build frontend assets?
1. `gulp build` - Compiles frontend assets and Design System Web UI
2. `gulp start` - Starts testing server using build files - good to check before deploying to production!

## 4. What are "frontend assets"?
Frontend assets are all the files needed to display frontend: css, js, html, fonts, image files etc.

## 5. How to create new page or new block for quick preview with client?
Launch development server `gulp dev`. Head over to `components/pages/`. Duplicate one of the **.hbs** files and corresponding **.config.json** file and change their name to reflect what you are creating. 
Edit both files.

## 6. What's the javascript files bundling setup and how to add new scripts?
Javascript files fall in one of two categories: **vendor** or **app**. Gulp tasks handle them in a slightly different manner. Running development server and building assets creates app.js and vendor.js files in respective folders.
1. **Vendor** scripts - 3rd party scripts like jQuery, carousels, popups etc. To add new script just add the file to `src\assets\js\vendor\` and add a reference to the file in `gulpfile.js` in `pathsToVendorScripts` const.
2. **App** scripts - project specific logic. All file names must have the *app.* prefix. Main.js file is the main starting point, usually running on document or window load. Please maintain the existing namespaced structure.

## 7. Where can I find the build assets?
After running `gulp build` all build assets appear in `www` folder.


## 8. What is the role of src, tmp and www folders?
### src
This is the folder where all development files and doc files exist.

#### tmp
Temporary files used in development process. This folder is wiped off everytime development server is launched, so never put anything valuable manually into it. Files in this folder should never be tempered with manually.

#### www
Optimised files ready to deploy to production server. Folder `assets` can be copied manually to another project.

## 9. How to reference image backgrounds in scss? 
Example: `background: url('../img/image-file.jpg');`

> Created by [Greenwood Campbell](https://greenwoodcampbell.com/)
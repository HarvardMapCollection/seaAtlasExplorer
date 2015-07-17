Sea Atlas Explorer
==================

This interface, developed by the Harvard Map Collection, displays pre-rendered tiles of georeferenced images for exploration and public consumption. This is the code that powers the Map Collection's [http://www.sea-atlases.org/maps/?atlas=all](Sea Atlas Exhibition)

If you'd like to re-use the code from this project, the best entry points are the geojson file that contains the details of each sea chart (`geoJson/all_atlases.geojson`) and the CSV file that contains information on the atlases themselves (`php/atlas_metadata.csv`). These serve as the basis for generating the map you see on the site. The main JavaScript powering the site is in `js/sea_atlas_explorer.js`. It will require some adaptation, but you may be able to build on our work in your own project.

If you need to generate map tiles from georeferenced images for your project, we used [http://www.gdal.org/gdal2tiles.html](gdal2tiles.py), and would recommend it for other projects as well.

Sea Atlases Project Process
===========================

_A note on vocabulary_: I use the word “chart” to refer to maps of the sea, as this is the preferred term.

At the beginning of the project, the primary goal was to enable the exploration and display of the charts contained in 10 atlases in a map-based fashion. The charts in question had already been georeferenced, but they could not be displayed online, and there was no interface through which to access them. My task was to provide such an interface, one that incorporates the display of georeferenced charts into an interface.

To display the georeferenced charts online, the original GeoTiffs were converted to OSGeo Tile Map Service (TMS) Specification tiles, a common web standard for such displays. This was accomplished using the gdal2tiles.py script, part of the GDAL library. It requires that both Python and the GDAL library be installed on the machine running it, and uses a command line interface for conversion. It also automatically generates a few basic, immediately usable html files to display the newly generated tiles. During this process, it was discovered that some of the GeoTiffs did not have their color settings preserved properly because they were generated with a different version of ArcGIS. However, gdal2tiles just as happily produced tiles for the original georeferenced jpegs, although the file extensions for their geographic metadata needed to be changed. The tile generation was performed overnight through a large shell script that repeated the gdal2tiles commands necessary to perform the conversion for each file. Each conversion produced a folder of image files that constitutes the TMS layer. Each folder was named following the naming standards for the chart files. The filenames consisted of DRS IDs, followed by “_MAPA/B/C” for pages that were split into multiple charts.  These folders were uploaded to the hosting server, and remained there for the course of the project.

The interface was built using Javascript. Specifically, it uses the Leaflet and jQuery frameworks, as well as several other small libraries. It uses two main inputs: a CSV file containing atlas-level metadata, and a GeoJson file containing chart-level metadata, including bounding boxes. The GeoJson file was originally created by Bonnie Burns, and through the course of the project, metadata was added to it, including several programmatically generated with Python. Documentation on the functioning of the Javascript code is present in the form of code comments throughout.

The Javascript application uses several other libraries. The licenses for these libraries are included in the LICENSES folder, and are included according to the terms under which the software was provided. All of the included libraries are released under varying kinds of open source licenses which allow for their use.

The application also relies on PHP for its operation. It was built in a local environment with PHP 5.5 and a server environment with PHP 5.3, and should work reliably with either.

The application has been developed with a git version control system in place, and currently exists both locally and (privately) on BitBucket.org.

The interface was tested on users throughout the last month of its development. These kind folks provided essential feedback on the site's design, and ranged from an experienced scholar to an undergraduate student.

# Big stuff

These are larger-scale issues with the site, more general problems in need of a fix:
- There's php here. This repo is mostly static, and it would be nice if I could fix things by updating this repo without asking anyone to upload changes to a server. Anything that can be static HTML with self-contained JS should be.
    - breadcrumbs.php
    - tile_display.php
    - mailer stuff:
        - contact.php
        - mailer.php
        - verificationimage.php
- There's no tests. I probably won't fix that.
- At least some of the JS is broken in some way.

# Other stuff

More specific, addressable issues
- The geojson files aren't valid. They at least need the polygons to be a full loop to be good.
- Why are things stored in tsvs? Stop that. Do something better for JS.
- ~~Need to define a base url for tiles, test with remote tiles~~
function flowmap(data, width, height){
    //Inspiration: https://gist.github.com/Andrew-Reid/8de4b9d0d0a87a478770e0cc86e2f5e4
    var locations = assignCoordinatesToLocations();

    var linePathGenerator = d3.svg.line()
    .x(function(d) { return d.coords[0]; })
    .y(function(d) { return d.coords[1]; });
    linePathGenerator(locations);

    var svgContainer = d3.select("body")
    .append("svg")
    .attr("width", "400")
    .attr("height", "400");

    var svgPath = svgContainer
    .append("path")
    .attr("stroke", "blue")
    .attr("stroke-width", "4px")
    .attr("fill", "none");

    svgPath
    .attr("d", linePathGenerator(locations));

    //d3.geoPath().MultiPoint(locations);
}

function assignCoordinatesToLocations() {
    //Coords in percent of image width/height
    var locations = {
        "Wrightiraptor Mountain": {id: 1, coords: [46.1, 89.2]},
        "Galactosaurus Rage": {id: 2, coords: [27.3, 86]},
        "Auvilotops Express": {id: 3, coords: [38.9, 12.1]},
        "TerrorSaur": {id: 4, coords: [78.4, 48.7]},
        "Wendisaurus Chase": {id: 5, coords: [16.2, 35.4]},
        "Keimosaurus Big Spin": {id: 6, coords: [88, 57.5]},
        "Firefall": {id: 7, coords: [19.4, 57.2]},
        "Atmosfear": {id: 8, coords: [45.5, 76.5]},
        "Flight of the Swingodon": {id: 81, coords: [68.5, 53.4]},
        "North Line": {id: 9, coords: [94.7, 17.3]},
        "Jeredactyl Jump": {id: 10, coords: [82.3, 23.3]},
        "Sauroma Bumpers": {id: 11, coords: [75.2, 18.7]},
        "Flying TyrAndrienkos": {id: 12, coords: [72.8, 15.5]},
        "Cyndisaurus Asteroid": {id: 13, coords: [79.5, 13.2]},
        "Beelzebufo": {id: 14, coords: [74.8, 12.6]},
        "Enchanted Toadstools": {id: 15, coords: [79.2, 10]},
        "Stegocycles": {id: 16, coords: [83, 18.2]},
        "Blue Iguanodon": {id: 17, coords: [83.5, 9.9]},
        "Wild Jungle Cruise": {id: 18, coords: [85.9, 13.5]},
        "Stone Cups": {id: 19, coords: [87.2, 17.3]},
        "Scholtz Express": {id: 20, coords: [3.9, 57]},
        "Paleocarrie Carousel": {id: 21, coords: [38.6, 31.1]},
        "Jurrasic Road": {id: 22, coords: [17.2, 30]},
        "Rhynasaurus Rampage": {id: 23, coords: [12.8, 48.7]},
        "Kauf's Lost Canyon Escape": {id: 24, coords: [43, 44]},
        "Maiasaur Madness": {id: 25, coords: [25, 39.8]},
        "Kristanodon Kaper": {id: 26, coords: [28.2, 35.6]},
        "Squidosaur": {id: 27, coords: [50, 12.1]},
        "Eberlesaurus Roundup": {id: 28, coords: [21.5, 43.9]},
        "Dykesadactyl Thrill": {id: 29, coords: [85.6, 51.1]},
        "Ichthyroberts Rapids": {id: 30, coords: [78.2, 60.1]},
        "Raptor Race": {id: 31, coords: [41.8, 20.2]},
        "Theresaur Food Stop": {id: 35, coords: [60.2, 51]},
        "Paleo Shreckwiches": {id: 36, coords: [35.2, 86.7]},
        "Krystal Cook Café": {id: 37, coords: [57.4, 8.1]},
        "Shilobite o'Pizza": {id: 38, coords: [53.9, 26.8]},
        "Chensational Sweets": {id: 39, coords: [88.9, 29]},
        "Smoky Wood BBQ": {id: 53, coords: [14.2, 58.6]},
        "Ice Age Cones": {id: 54, coords: [85.9, 22.4]},
        "Plaisantly Popped Corn": {id: 55, coords: [76, 37.4]},
        "Floral Funnels": {id: 56, coords: [43.8, 26]},
        "Permafrosties": {id: 57, coords: [40.4, 78.2]},
        "Granite Slab Pizza": {id: 58, coords: [47.9, 22.4]},
        "EberTrex Fries": {id: 59, coords: [23.1, 35.6]},
        "Raptor Restroom": {id: 49, coords: [2.8, 35.9]},
        "Tar Pit Stop": {id: 50, coords: [52.5, 72.9]},
        "LavaTory": {id: 51, coords: [56.5, 47.5]},
        "TriceraStop": {id: 52, coords: [78.3, 28.6]},
        "Darwin's Stop": {id: 65, coords: [23.7, 71.7]},
        "Tyrannosaurus Rest": {id: 66, coords: [70.9, 78.8]},
        "Fisching Rooms": {id: 67, coords: [91.7, 23.9]},
        "Alvarez Beer Garden": {id: 33, coords: [14.5, 65.2]},
        "Mary Anning Beer Garden": {id: 34, coords: [81, 72.8]},
        "Munzasaurus Souvenirs": {id: 40, coords: [43.2, 37.8]},
        "Laskonasaur Store": {id: 41, coords: [53.9, 36.3]},
        "World of WarRocks Shop": {id: 42, coords: [18.4, 52.3]},
        "Whitley's Plushadactyl": {id: 43, coords: [43, 73.4]},
        "Staskosaurus Designs": {id: 44, coords: [71.1, 27.2]},
        "Dino Chic Clothing": {id: 45, coords: [53.6, 20.5]},
        "Petroglyph Body Art": {id: 46, coords: [23.6, 65.8]},
        "League of Legenodons": {id: 47, coords: [70.9, 41.3]},
        "The Magic Cavern": {id: 48, coords: [28.8, 30.8]},
        "Creighton Pavilion": {id: 32, coords: [32.5, 23.5]},
        "Grinosaurus Stage": {id: 63, coords: [82, 84.5]},
        "SabreTooth Theatre": {id: 64, coords: [84, 38]},
        "Primal Carnage Arcade": {id: 61, coords: [70.9, 32.4]},
        "Daily Slab Maps and Info": {id: 60, coords: [68.7, 7.8]},
        "Liggement Fix-Me-Up": {id: 62, coords: [51.9, 42.2]}
    }
    return locations;
}
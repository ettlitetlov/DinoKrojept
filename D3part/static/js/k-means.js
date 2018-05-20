/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/

/**
* Todo: Look up if all the values should be passed to the functions or treated as global. 
*/

function kmeans(data, k) {
    k = parseInt(k);
    var numberOfDataPoints = data.length;
    var dimension = Object.keys(data[0]).length;
    var centroids = generateInitialCentroids(k);

    var points = {
        "assignments": new Array(numberOfDataPoints),
        "distance": new Array(numberOfDataPoints)
    };

    var oldQualityOfClusters = Infinity, qualityOfClusters = 1000000000000.0; //<--find better initial value

    while (oldQualityOfClusters > qualityOfClusters) { //<-- Possibly need to add threshold here. 
        oldQualityOfClusters = qualityOfClusters;
        assignPointsToCluster();
        recalcClusterCentroids();
        qualityOfClusters = calcQualityOfClusters();
    }

    return points;

    function calcQualityOfClusters() {
        return d3.sum(points.distance);
    }

    function recalcClusterCentroids() {
        var clusterSums = [];
        var numberOfPointsInClusters = new Array(k);
        numberOfPointsInClusters.fill(0);
        for (var i = 0; i < k; i++) {
            clusterSums.push(new Array(dimension).fill(0));
        }

        for (var point = 0; point < numberOfDataPoints; point++) {
            var cluster = points.assignments[point];
            numberOfPointsInClusters[cluster] += 1;
            for (var dim = 0; dim < dimension; dim++) {
                clusterSums[cluster][dim] += parseFloat(Object.values(data[point])[dim]);
            }
        }
        for (var cluster = 0; cluster < k; cluster++) {
            for (var dim = 0; dim < dimension; dim++) {
                if (numberOfPointsInClusters[cluster] != 0) {
                    centroids[cluster][dim] = clusterSums[cluster][dim] / numberOfPointsInClusters[cluster];
                }
                else {
                    centroids[cluster][dim] = 0;
                }
            }
        }
    }

    function assignPointsToCluster() {
        for (var point = 0; point < numberOfDataPoints; point++) {
            var closestCentroid = findClosestCentroidToPoint(point);
            points.assignments[point] = closestCentroid;
        }
    }

    function findClosestCentroidToPoint(point) {
        var closestCentroid = -1,
            closestDistance = Infinity; 

        for (var centroid = 0; centroid < k; centroid++) {
            var currentDistance = calcEuclideanDistance(centroids[centroid], Object.values(data[point]));
            if (currentDistance < closestDistance) {
                closestCentroid = centroid;
                closestDistance = currentDistance;
            }
        }
        points.distance[point] = closestDistance; 
        return closestCentroid;
    }

    function calcEuclideanDistance(point1, point2) {
        var sum = 0;
        for (var i = 0; i < point1.length; i++) {
            sum += Math.pow(point1[i] - point2[i], 2);
        }
        return Math.sqrt(sum);
    }

    function generateInitialCentroids(k) {
        var centroids = [];
        for (var i = 0; i < k; i++) {
            centroids.push(Object.values(data[Math.floor(Math.random() * data.length)]));
        }
        return centroids;
    }
  
};


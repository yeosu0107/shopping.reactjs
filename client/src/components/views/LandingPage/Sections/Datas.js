const continents = [
    {
        "_id":1,
        "name": "Africa"
    },
    {
        "_id":2,
        "name": "Europe"
    },
    {
        "_id":3,
        "name": "Asia"
    },
    {
        "_id":4,
        "name": "North America"
    },
    {
        "_id":5,
        "name": "South America"
    },
    {
        "_id":6,
        "name": "Australia"
    },
    {
        "_id":7,
        "name": "Autarctica"
    }
]

const price = [
    {
        "_id": 0,
        "name": "Any",
        "array": []
    },
    {
        "_id": 1,
        "name": "0 to 9999",
        "array": [0, 9999]
    },
    {
        "_id": 2,
        "name": "10000 to 19999",
        "array": [10000, 19999]
    },
    {
        "_id": 3,
        "name": "20000 to 29999",
        "array": [20000, 29999]
    },
    {
        "_id": 4,
        "name": "30000 to 39999",
        "array": [30000, 39999]
    },
    {
        "_id": 5,
        "name": "more than 40000",
        "array": [40000, 10000000]
    }
]

export {
    continents,
    price
}
module.exports = {

    mocks: [
        {
            url: '/api/dashboards',
            data: [{
                "_id": "54a26f9a51ef6941aa335b93",
                "name": "api",
                "creation_date": "2014-12-30T09:25:46.434Z",
                "private": false,
                "widgets": [{
                    "size": {"y": 1, "x": 1},
                    "position": [2, 0],
                    "_id": "54a270251dfa6a55aa6eb8ca"
                }, {"_id": "54a2703c1dfa6a55aa6eb8cc", "position": [0, 0], "size": {"y": 1, "x": 1}}, {
                    "size": {
                        "x": 1,
                        "y": 1
                    }, "position": [0, 1], "_id": "54a270801dfa6a55aa6eb8cf"
                }, {"size": {"x": 1, "y": 1}, "position": [3, 1], "_id": "54a270981dfa6a55aa6eb8d1"}, {
                    "size": {
                        "x": 1,
                        "y": 1
                    }, "position": [1, 1], "_id": "54a270a21dfa6a55aa6eb8d2"
                }, {"size": {"x": 1, "y": 1}, "position": [0, 2], "_id": "54a277de5fe587c3ab654cae"}, {
                    "size": {
                        "x": 1,
                        "y": 1
                    }, "position": [1, 2], "_id": "54a27855c4b4e3d6ab82b406"
                }, {"size": {"x": 1, "y": 1}, "position": [2, 2], "_id": "54a2785ac4b4e3d6ab82b407"}, {
                    "size": {
                        "x": 1,
                        "y": 1
                    }, "position": [0, 3], "_id": "54a27867c4b4e3d6ab82b408"
                }, {"size": {"y": 1, "x": 1}, "position": [1, 3], "_id": "54a2786cc4b4e3d6ab82b409"}, {
                    "size": {
                        "x": 1,
                        "y": 1
                    }, "position": [2, 3], "_id": "54a27871c4b4e3d6ab82b40a"
                }, {"size": {"x": 1, "y": 1}, "position": [0, 4], "_id": "54a2787bc4b4e3d6ab82b40b"}, {
                    "size": {
                        "x": 1,
                        "y": 1
                    }, "position": [1, 4], "_id": "54a27880c4b4e3d6ab82b40c"
                }, {
                    "size": {"x": 3, "y": 2},
                    "position": [0, 5],
                    "_id": "54a2794bc4b4e3d6ab82b40d"
                }, {"_id": "54a27a01c4b4e3d6ab82b40e", "position": [2, 4], "size": {"y": 2, "x": 2}}, {
                    "size": {
                        "x": 2,
                        "y": 2
                    }, "position": [0, 8], "_id": "54a27a38c4b4e3d6ab82b40f"
                }, {
                    "_id": "54bb026a66d9580000e74dab",
                    "position": [0, 0],
                    "size": {"y": 1, "x": 1}
                }, {
                    "_id": "54bccf53bd781c0507da87bf",
                    "position": [2, 6],
                    "size": {"x": 1, "y": 1}
                }, {
                    "_id": "54bcd3076e97fff007141eb6",
                    "position": [2, 7],
                    "size": {"y": 1, "x": 2}
                }, {"_id": "54cc80b1d3e7ab97d2f1e05c", "position": [3, 2], "size": {"x": 1, "y": 1}}],
                "url": "d5cf8220900511e4ac9af7ada58835f8"
            }, {
                "_id": "54bccd8048cd52e10614caab",
                "name": "frontend",
                "creation_date": "2015-01-19T09:25:20.787Z",
                "private": false,
                "widgets": [{
                    "size": {"x": 2, "y": 1},
                    "position": [0, 0],
                    "_id": "54bcce2348cd52e10614caac"
                }, {"size": {"x": 5, "y": 2}, "position": [0, 0], "_id": "54be319cbc0195e00d7f28fc"}],
                "url": "16c916309fbd11e4942a5721548dd71e"
            }]
        },
        {
            url: '/api/dashboard/api',
            data: {
                "_id": "54a26f9a51ef6941aa335b93",
                "name": "api",
                "creation_date": "2014-12-30T09:25:46.434Z",
                "private": false,
                "widgets": [{
                    "position": [2, 0],
                    "size": {"y": 1, "x": 1},
                    "key": "28cdffb0-9006-11e4-9528-8f2767eb3a93",
                    "caption": "Test1",
                    "datasource": "push",
                    "data": {"text": "Test Text1"},
                    "creation_date": "2014-12-30T09:28:05.675Z",
                    "last_update_date": "2015-01-31T07:47:29.478Z",
                    "type": "text",
                    "_id": "54a270251dfa6a55aa6eb8ca"
                }, {
                    "position": [0, 0],
                    "size": {"y": 1, "x": 1},
                    "key": "362b7a20-9006-11e4-9528-8f2767eb3a93",
                    "caption": "Test2",
                    "datasource": "push",
                    "data": {"empty": true},
                    "creation_date": "2014-12-30T09:28:28.098Z",
                    "last_update_date": "1970-01-01T00:00:00.000Z",
                    "type": "text",
                    "_id": "54a2703c1dfa6a55aa6eb8cc"
                }, {
                    "position": [0, 1],
                    "size": {"x": 1, "y": 1},
                    "key": "5f2f81f1-9006-11e4-9528-8f2767eb3a93",
                    "caption": "Pew pew",
                    "datasource": "push",
                    "data": {"status": "up"},
                    "creation_date": "2014-12-30T09:29:36.911Z",
                    "last_update_date": "2014-12-30T09:30:43.063Z",
                    "type": "status",
                    "_id": "54a270801dfa6a55aa6eb8cf"
                }, {
                    "position": [3, 1],
                    "size": {"x": 1, "y": 1},
                    "key": "6d19fa21-9006-11e4-9528-8f2767eb3a93",
                    "caption": "Kittens",
                    "datasource": "push",
                    "data": {"status": "up"},
                    "creation_date": "2014-12-30T09:30:00.258Z",
                    "last_update_date": "2014-12-30T09:31:13.885Z",
                    "type": "status",
                    "_id": "54a270981dfa6a55aa6eb8d1"
                }, {
                    "position": [1, 1],
                    "size": {"x": 1, "y": 1},
                    "key": "73384ab0-9006-11e4-9528-8f2767eb3a93",
                    "caption": "LOL",
                    "datasource": "push",
                    "data": {"status": "up"},
                    "creation_date": "2014-12-30T09:30:10.523Z",
                    "last_update_date": "2014-12-30T09:31:04.978Z",
                    "type": "status",
                    "_id": "54a270a21dfa6a55aa6eb8d2"
                }, {
                    "position": [0, 2],
                    "size": {"x": 1, "y": 1},
                    "key": "c35f8f91-900a-11e4-9da7-f92f40a9ce0e",
                    "caption": "Server",
                    "datasource": "push",
                    "data": {"status": "up"},
                    "creation_date": "2014-12-30T10:01:02.985Z",
                    "last_update_date": "2014-12-30T10:03:56.607Z",
                    "type": "status",
                    "_id": "54a277de5fe587c3ab654cae"
                }, {
                    "position": [1, 2],
                    "size": {"x": 1, "y": 1},
                    "key": "09e685e0-900b-11e4-a6e5-8716915bb194",
                    "caption": "Example",
                    "datasource": "push",
                    "data": {"status": "up"},
                    "creation_date": "2014-12-30T10:03:01.310Z",
                    "last_update_date": "2014-12-30T10:04:05.048Z",
                    "type": "status",
                    "_id": "54a27855c4b4e3d6ab82b406"
                }, {
                    "position": [2, 2],
                    "size": {"x": 1, "y": 1},
                    "key": "0d032f31-900b-11e4-a6e5-8716915bb194",
                    "caption": "No way",
                    "datasource": "push",
                    "data": {"status": "up"},
                    "creation_date": "2014-12-30T10:03:06.531Z",
                    "last_update_date": "2014-12-30T10:04:14.011Z",
                    "type": "status",
                    "_id": "54a2785ac4b4e3d6ab82b407"
                }, {
                    "position": [0, 3],
                    "size": {"x": 1, "y": 1},
                    "key": "14a47640-900b-11e4-a6e5-8716915bb194",
                    "caption": "SOAP",
                    "datasource": "push",
                    "data": {"status": "up"},
                    "creation_date": "2014-12-30T10:03:19.332Z",
                    "last_update_date": "2014-12-30T10:04:49.854Z",
                    "type": "status",
                    "_id": "54a27867c4b4e3d6ab82b408"
                }, {
                    "position": [1, 3],
                    "size": {"y": 1, "x": 1},
                    "key": "17c146a1-900b-11e4-a6e5-8716915bb194",
                    "caption": "It's a trap",
                    "datasource": "push",
                    "data": {"status": "down"},
                    "creation_date": "2014-12-30T10:03:24.554Z",
                    "last_update_date": "2014-12-30T10:04:34.494Z",
                    "type": "status",
                    "_id": "54a2786cc4b4e3d6ab82b409"
                }, {
                    "position": [2, 3],
                    "size": {"x": 1, "y": 1},
                    "key": "1aa74f91-900b-11e4-a6e5-8716915bb194",
                    "caption": "Tea",
                    "datasource": "push",
                    "data": {"status": "down"},
                    "creation_date": "2014-12-30T10:03:29.417Z",
                    "last_update_date": "2015-01-31T07:13:23.598Z",
                    "type": "status",
                    "_id": "54a27871c4b4e3d6ab82b40a"
                }, {
                    "position": [0, 4],
                    "size": {"x": 1, "y": 1},
                    "key": "20a0b301-900b-11e4-a6e5-8716915bb194",
                    "caption": "Party",
                    "datasource": "push",
                    "data": {"status": "down"},
                    "creation_date": "2014-12-30T10:03:39.441Z",
                    "last_update_date": "2014-12-30T10:05:17.400Z",
                    "type": "status",
                    "_id": "54a2787bc4b4e3d6ab82b40b"
                }, {
                    "position": [1, 4],
                    "size": {"x": 1, "y": 1},
                    "key": "235a06a1-900b-11e4-a6e5-8716915bb194",
                    "caption": "JS",
                    "datasource": "push",
                    "data": {"status": "up"},
                    "creation_date": "2014-12-30T10:03:44.010Z",
                    "last_update_date": "2014-12-30T10:05:05.734Z",
                    "type": "status",
                    "_id": "54a27880c4b4e3d6ab82b40c"
                }, {
                    "position": [0, 5],
                    "size": {"x": 3, "y": 2},
                    "key": "9cd98aa1-900b-11e4-a6e5-8716915bb194",
                    "caption": "Browser share",
                    "datasource": "push",
                    "data": {
                        "series": [{
                            "data": [["Firefox", 45], ["IE", 26.8], ["Chrome", 12.8], ["Safari", 8.5], ["Opera", 6.2], ["Others", 0.7]],
                            "name": "Browser share",
                            "type": "pie"
                        }],
                        "plotOptions": {"pie": {"dataLabels": {"enabled": true}}},
                        "chart": {"plotShadow": false}
                    },
                    "creation_date": "2014-12-30T10:07:07.850Z",
                    "last_update_date": "2015-01-26T02:25:49.763Z",
                    "title": {"text": " "},
                    "type": "highcharts",
                    "_id": "54a2794bc4b4e3d6ab82b40d"
                }, {
                    "position": [2, 4],
                    "size": {"y": 2, "x": 2},
                    "key": "08d76a61-900c-11e4-a6e5-8716915bb194",
                    "caption": "",
                    "datasource": "push",
                    "data": [{"label": "Example", "value": 24}, {"label": "New Example", "value": 52.12}],
                    "creation_date": "2014-12-30T10:10:09.030Z",
                    "last_update_date": "2015-01-29T11:27:17.011Z",
                    "type": "list",
                    "_id": "54a27a01c4b4e3d6ab82b40e"
                }, {
                    "position": [0, 8],
                    "size": {"x": 2, "y": 2},
                    "key": "29c76c20-900c-11e4-a6e5-8716915bb194",
                    "caption": "",
                    "datasource": "push",
                    "data": [{"value": 54, "label": "Unknown stuff"}, {"value": 16, "label": "Kittens"}, {
                        "value": 3,
                        "label": "People"
                    }, {"value": 3, "label": "Normal"}, {"value": 2, "label": "Too low"}, {
                        "value": 2,
                        "label": "Teaparty"
                    }, {"value": 2, "label": "Test"}, {"value": 1, "label": "Test 2"}],
                    "creation_date": "2014-12-30T10:11:04.290Z",
                    "last_update_date": "2014-12-30T10:11:34.235Z",
                    "type": "list",
                    "_id": "54a27a38c4b4e3d6ab82b40f"
                }, {
                    "position": [0, 0],
                    "size": {"y": 1, "x": 1},
                    "key": "73d62dd0-9eab-11e4-8802-f1ee4134b915",
                    "caption": "Test4",
                    "datasource": "push",
                    "data": {"empty": true},
                    "creation_date": "2015-01-18T00:46:34.797Z",
                    "last_update_date": "1970-01-01T00:00:00.000Z",
                    "type": "text",
                    "_id": "54bb026a66d9580000e74dab"
                }, {
                    "position": [2, 6],
                    "size": {"x": 1, "y": 1},
                    "key": "2cb8d1f0-9fbe-11e4-a180-47ce1a26ab64",
                    "caption": "Test web",
                    "datasource": "push",
                    "data": [{"value": 11, "text": "5XX"}, {"value": 22, "text": "4XX"}, {
                        "value": 33,
                        "text": "200 Status Code"
                    }],
                    "creation_date": "2015-01-19T09:33:07.087Z",
                    "last_update_date": "2015-01-31T07:11:38.034Z",
                    "type": "rag",
                    "_id": "54bccf53bd781c0507da87bf"
                }, {
                    "position": [2, 7],
                    "size": {"y": 1, "x": 2},
                    "key": "62465070-9fc0-11e4-a490-7fb3698741f2",
                    "caption": "Unit tests",
                    "datasource": "push",
                    "data": {"value": 35},
                    "creation_date": "2015-01-19T09:48:55.927Z",
                    "last_update_date": "2015-02-01T10:29:04.389Z",
                    "type": "number",
                    "_id": "54bcd3076e97fff007141eb6"
                }, {
                    "position": [3, 2],
                    "size": {"x": 1, "y": 1},
                    "key": "b66e7901-a918-11e4-8515-1347f9a6068f",
                    "caption": "Test5",
                    "datasource": "push",
                    "data": {"text": "Text here"},
                    "creation_date": "2015-01-31T07:13:53.296Z",
                    "last_update_date": "2015-01-31T07:46:37.252Z",
                    "type": "text",
                    "_id": "54cc80b1d3e7ab97d2f1e05c"
                }],
                "url": "d5cf8220900511e4ac9af7ada58835f8",
                "status": "ok"
            }
        }
    ]
};

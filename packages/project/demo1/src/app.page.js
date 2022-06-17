module.exports = {
    pages: [
        "pages/index/index",
        "pages/test/index",
        "npm:pages/page4/index",
    ],
    subpackages:[
        {
          "root": "module1",
          "pages": [
            "pages/act/index",
            "npm:pages/page3/index",
          ]
        },
        {
          "root": "module2",
          "pages": [
            "npm:pages/page1/index",
          ]
        },
        {
          "root": "module3",
          "pages": [
            "npm:pages/page2/index",
          ]
        }
    ]
 }
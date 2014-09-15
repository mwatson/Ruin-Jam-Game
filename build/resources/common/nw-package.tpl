{
        "main": "index.html", 
        "name": "<%= pkg.appBuild.fullname %>",
        "description": "<%= pkg.description %>",
        "version": "<%= pkg.version %>",
        "window": {
            "title": "<%= pkg.appBuild.fullname %>", 
            "width": <%= pkg.appBuild.width %>, 
            "height": <%= pkg.appBuild.height %>,  
            "icon": "assets/img/rb.iconset/icon_128x128.png", 
            "resizable": <%= pkg.appBuild.resizable %>, 
            "toolbar": <%= pkg.appBuild.toolbar %>, 
            "frame": <%= pkg.appBuild.frame %>
        }
}

{
  "build": {
    "command": "npm run build",
    "publish": "public",
    "nodeVersion": "16"
  },
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/.*",
      "dest": "/index.html",
      "status": 200
    }
  ]
}

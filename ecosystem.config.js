module.exports = {
  apps : [{
    name   : "clover-web",
    script : "./node_modules/.bin/next",
    args: "start -p 8080",
    max_memory_restart: "2G",
    exec_mode : "cluster"
  }]
};

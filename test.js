/**
Parent test module, run all additional test files from here.
**/

var SchedulerTests = require("./tests/scheduler_test");
var SessionTests = require("./tests/session_test");
var BlockListTests = require("./tests/blocklist_test");

SchedulerTests();
SessionTests();
BlockListTests();
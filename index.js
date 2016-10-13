"use strict";

var clie = require("clie");
var events = require("events");
var LogTelemetryEvents = require("telemetry-events-log");
var path = require("path");
var TelemetryEvents = require("telemetry-events");

var bin = module.exports = function bin(pkg, commandsDirectory)
{
    // configure cli telemetry
    var cli = new events.EventEmitter();
    cli.on("telemetry", function(event)
    {
        console.log(JSON.stringify(event));
    });
    var cliTelemetryEmitter = new TelemetryEvents(
    {
        package: pkg,
        emitter: cli
    });
    var cliTelemetry = new LogTelemetryEvents(
    {
        telemetry: cliTelemetryEmitter
    });

    process.on("uncaughtException", function(error)
    {
        cliTelemetry.log("error", error.message,
        {
            error: error,
            stack: error.stack,
            uncaught: true
        });
    });

    // configure app
    var app = clie({commandsDirectory: commandsDirectory}).cli();

    app.on("data", function(data)
    {
        if (typeof data === "string")
        {
            return process.stdout.write(data);
        }
        cliTelemetryEmitter.emit(data);
    });

    app.on("error", function(error)
    {
        if (typeof error === "string")
        {
            return process.stderr.write(error);
        }
        cliTelemetryEmitter.emit(error);
    });

    app.on("end", function()
    {
        cliTelemetry.log("info", "exiting",
        {
            exit: 0
        });
        setImmediate(() => process.exit(0));
    });

    app.on("exit", function(exitCode)
    {
        cliTelemetry.log("info", "exiting",
        {
            exit: exitCode
        });
        setImmediate(() => process.exit(exitCode));
    });
};

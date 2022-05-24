

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const GOOGLE_PRIVATE_KEY = require("../config/credentials.json").private_key
const GOOGLE_CLIENT_EMAIL = require("../config/credentials.json").client_email
const GOOGLE_PROJECT_NUMBER = require("../config/credentials.json").google_project_number
const GOOGLE_CALENDAR_ID = require("../config/credentials.json").google_calendar_ID

const { Message } = require("discord.js");
const { google } = require('googleapis');

const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    SCOPES
);

const calendar = google.calendar({
    version: 'v3',
    project: GOOGLE_PROJECT_NUMBER,
    auth: jwtClient
});

// this will be called every minute. If it is the beginning of the hour, the calendar will be checked for updates
async function tick() {
    //get the mins of the current time
    var mins = new Date().getMinutes();

    // at the first minute of every hour, or always if its in dev mode
    if (mins == "00" || process.env.DEV_STAGE != "production") {
        checkCalEvents();
    }
}

// checks if there are any events occuring in the next 61 minutes. Sends an announcment if there are any
async function checkCalEvents() {
    let channel;
    let announcement = [];
    if (process.env.DEV_STAGE === "production") {
        channel = await require("../index.js").channels.fetch("968336471356481590"); // announcements channel
    } else {
        channel = await require("../index.js").channels.fetch("976886092789874739"); // mods channel
        // announcement.push("[THIS IS A TESTING MESSAGE]");
    }

    // query the calendar
    calendar.events.list({
        calendarId: GOOGLE_CALENDAR_ID,
        timeMin: (new Date()).toISOString(),
        timeMax: (new Date(Date.now() + 61 * 60000)).toISOString(), // starting without one hour and five minutes
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);

        for (const event of res.data.items) {
            if (event.colorId == 4) {
                // found an event of the proper color (flamingo).
                let start = new Date(event.start.dateTime);
                
                if (start - Date.now() > 1000 * 60 * 14 || start - Date.now() < 0) return;

                let hours = start.getHours();
                let minutes = start.getMinutes();
                let ampm = "am";

                // convert from 24 hour clock to 12 hour clock
                if (hours > 12) {
                    hours -= 12;
                    ampm = "pm";
                }

                // make sure that it says, for example, 9:05 pm instead of 9:5 pm
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                announcement.push(`@everyone This is a reminder that **${event.summary}** will be starting at **${hours}:${minutes}${ampm}!**`);

                if (event.description) // if there is a description, send that too
                    announcement.push(`${event.description}`);
            }
            if (announcement.length) {
                channel.send(announcement.join("\n"));
            }
        }
    });

}

// minutely tick (every second in dev mode)
setInterval(tick, 60 * 1000 * 15);
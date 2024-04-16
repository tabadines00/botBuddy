// Import env file
import dotenv from "dotenv"
dotenv.config()

// Set up axios for fetching API data

import axios from "axios"

// Set up OpenAI API

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Setting up the Discord bot client

import {
    Client,
    GatewayIntentBits,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
 } from "discord.js"

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.login(process.env.DISCORD_TOKEN)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Helper Functions /////////////////////////////////////////////////////////////////

async function getDuckPic(){
    const picUrl = 'https://random-d.uk/api/v2/random'
    const res = await axios.get(picUrl);
    return res.data.url;
}

async function getNextHoliday(){
    const url = 'https://date.nager.at/api/v3/NextPublicHolidays/US'
    const res = await axios.get(url);
    return res.data[0].localName;
}

async function getGPTAnswer(userMsg) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: userMsg }],
      model: "gpt-3.5-turbo",
      max_tokens: 256
    });
    console.log(chatCompletion.choices[0])
    return chatCompletion.choices[0].message.content
  }

// Bot actions

client.on('messageCreate', async msg => {
    console.log(msg.content)
    if(!message?.author.bot) {
        switch (msg.content.split(' ')[0]) {
            // Hello!
            case "Hello":
                msg.reply(`Hello ${msg.author.username}`)
                break

            // Ping replier
            case "ping":
                msg.reply("Pong!")
                break

            // Duck Command to get a random duck
            case "!duck":
                msg.channel.send("Here's your duck!") //the reply to the user command
                let duckImg = await getDuckPic() //fetches the URL from the API
                msg.channel.send(duckImg) //sends the image URL to Discord
                break

            // Command to get the next US Holiday
            case "!nextUSHoliday":
                let day = await getNextHoliday() //fetches the URL from the API
                msg.channel.send("The next US Holiday is " + day)
                break

            // Command to ask ChatGPT a question
            case "!askGPT":
                let GPTreply = await getGPTAnswer(msg.content) //fetches the URL from the API
                msg.channel.send(GPTreply)
                break
        }
    }
})

// TODO
// const btn = new ButtonBuilder()
//                     .setCustomId('hiYall')
//                     .setLabel('Say Hi everyone!')
//                     .setStyle(ButtonStyle.Primary)

// client.on("messageCreate", async (message) => {
//     console.log(message)
//     if(!message?.author.bot) {
//         message.author.send({
//             content: "Push the btn!",
//             components: [btn]
//         })
//     }
// })

// client.on("interactionCreate", async (interaction) => {
//     if(interaction.customId === 'hiYall') {
//         await interaction.reply({
//             content: 'Oh hello there!',
//             ephemeral: true
//         })
//     }
// })
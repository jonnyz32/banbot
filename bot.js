const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();


// Create a new Discord client with the specified intents
const client = new Client({ intents:[
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent

] });

// Define a list of user IDs to ban
const bannedWords = ["bettermint"]
const bannedUserIDs = ['840316576942391356', '1098369539990900757','1141163770794754058','1083871067786985546','1069727217636093982','829175208719810561','905903932050645023','674662478172389397','1045429397836021852','792134699359010856','1022160261320286323','966639202374668348','852157504908689418','730480523314724874','947963729113382933','984520203524272129','831038395294941185','774465756841902090','438489624005050368','1064514329417887815','970329699903496223','916831844195000420','815071602785910794','783176171566399489','759390626285355059','662841213132603413','1087567107048341554','820971266918973480','710573556013989888','406800355242934283','786829953366753310','860155865951895572','87266333443497984','536221832668381195','714992461444939797','564673226278699028','995477553756258384','129052551147552768','732603229300326431','908405076148776980','270694196128645122','241795871904104448','903600364417347584','1081334533321924730','289907756373114881','1062613978716577822','460137877028732958','346046595252355072','975971292656324619','362121681193402371','754501467620245659','845596037049483264','776539081651126282','702248258948300833','801353076488929301','1086054926926491709','226534189762215936','804092352280526868','847703835328905266','1032479383966978058','842039629615595581','620084506073759754','400282187708104704','442710003023872013','821806811496972399','601516731697201168','629489115510865920','348934147860856834','598390900758151181','590873513645047808','607437574646005781','592801819806269480','832951773403676702','286388611694329857','1071451982826573865','1017227599367385128','113463044922728448','747616780226265178','579810483826065444','925391501431832597','725065005397180487','254133324384174080','804251345863311412','1053520255047180358','301845982050648066','817466473450045470','644018142007263232','471164323813654546','313425274081378328','923389620044046396','517370366667259934','802610807015735307','248556200864645121','155763826049024000','1107569049795305492','948778190422294608','955721520364290059','823686868931444756','1049574035303976981','1066668444877074542','1097984861333098647','886317089076441099','717047382952640603','1033639158368981022','889889835249180743','875870221917892648','758877540005314611','854997435146305536','995143460963221504','979932103355539506','574228042352689164','297388458509598722','774608244164657163','465228574350114817','727810119122944020','921099325365428225','556034668340707331','500748907525963776','955723275051364372','571495228024946689','1037207496869294120','713518780566732961','756189935496855603','239241973783986178','197137107389644800','851512212269957190','775326794684432434','884947813744640020','709189461828960344','823219067975368764','613816870205915140','792937567694749716','385684465688510465','849943857319772162','384741254254297089','1043036509319741490','539009825997062145','874045112483717191','1074910773224165490','776546910147969084','999736048596816014','270904126974590976','792842038332358656','155149108183695360','727765671903101011','790967448111153153','550613223733329920','557628352828014614','1057043734526701589','1095366236306681919','1139598449201909820','1103008184920191036','1000128545898631178','321515244243517441','942805171388436481','707495972518756392','765911047759855656','789279692892667924','491523779973873664','704350072262885417','795138474578804736','829711734679011338','757890642515984444','965455149671796786']
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const deleteMessages = (message, bannedUser) => {
    message.channel.messages.fetch({ limit: 100 })
    .then((messages) => {
      // Filter messages sent by the banned user
      const userMessages = messages.filter((msg) => msg.author.id === bannedUser.user.id);

      // Delete the user's messages
      userMessages.forEach((msg) => {
        msg.delete()
          .catch((error) => {
            console.error('Error deleting message:', error);
          });
      })
  })
    
}

client.on('guildMemberAdd', (member) => {
    console.log("joined user id is", member.user.id)
  if (bannedUserIDs.includes(member.user.id)) {
    // Ban the user if their ID is in the banned list
    member.ban()
      .then(() => {
        console.log(`User with ID ${member.user.id} has been banned.`);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

client.on('messageCreate', (message) => {
    // Check if the message contains the banned word (case-insensitive)
    const content = message.content.toLowerCase();
    console.log("content", content)

    for (const word of bannedWords){
        if(content.indexOf(word) !== -1){
            console.log("banning for ", word)
            message.member.ban()
            .then((bannedUser) => {
              console.log(`Banned user: ${bannedUser.user.tag}`);
              deleteMessages(message, bannedUser)
        })
            .catch((error) => {
              console.error('Error banning user:', error);
            });
        }
    }

    // Check if the message has file attachments
  if (message.attachments.size > 0) {
    // Iterate through the attachments
    for (const attachment of message.attachments.values()) {
      // Check if the attachment is a ZIP file based on its MIME type or file extension
      if (
        attachment.contentType === 'application/zip' ||
        attachment.name.endsWith('.zip') ||
        attachment.contentType === 'application/javascript' ||  // JavaScript file
        attachment.contentType === 'text/html' ||  // HTML file
        attachment.contentType === 'text/css' ||   // CSS file
        attachment.contentType === 'application/json' ||  // JSON file
        attachment.name.endsWith('.zip') ||          // ZIP file
        attachment.name.endsWith('.js') ||           // JavaScript file
        attachment.name.endsWith('.html') ||         // HTML file
        attachment.name.endsWith('.css') ||          // CSS file
        attachment.name.endsWith('.json')           
      ) {
        console.log("Banning attachment", attachment.name)
        // Ban the user who sent the message
        message.member.ban()
          .then((bannedUser) => {
            console.log(`Banned user: ${bannedUser.user.tag}`);
            deleteMessages(message, bannedUser)
          })
          .catch((error) => {
            console.error('Error banning user:', error);
          });
      }
    }
}

  });

const token = 'MTE0MjY1Nzc0MDEyOTQ1NjE4OQ.GU1GIs.RM-EgQLChDGHW6zqLkiDPYbKgPnnNRAmgghdSM';
client.login(token);
const PORT = process.env.PORT || 3300; // Use Heroku's assigned port or a default port

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
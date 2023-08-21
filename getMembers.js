import fetch from 'node-fetch';
const token = 'MTE0MjUwOTAwMDM3ODgxODY5MA.seNSMR-MTKo4KNAyb-tbOAqvEEY'; // Replace with your Bot Token
const guildId = '1098267851732815932'; // Replace with your Guild ID

async function getMembers() {
  const response = await fetch(`https://discord.com/api/v9/channels/1098267851770576924/messages?before=1141556968511770714&limit=2000`, {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
    },
  });

  if (response.ok) {
    const members = await response.json();
    console.log(members);
  } else {
    console.error('Failed to fetch members:', response.status, response.statusText);
  }
}

getMembers();

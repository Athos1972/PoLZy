/*
** Gamification Badges API Calls
*/

export const pushNotifications = async (user) => {
  const response = await fetch("/api/notifications", {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  //const data = await response.json()

  if (!response.ok) {
    throw new Error('Push Notifications Failed')
  }
  
}
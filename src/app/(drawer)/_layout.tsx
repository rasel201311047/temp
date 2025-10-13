import { Stack } from 'expo-router'
import React from 'react'

export default function DrawerLayout() {
  return (
    <Stack>
      <Stack.Screen name='laws' options={{ headerShown: false }} />
      <Stack.Screen name='doctrine' options={{ headerShown: false }} />
      <Stack.Screen name='searchchapter' options={{ headerShown: false }} />
      <Stack.Screen name='bookmarks' options={{ headerShown: false }} />
      <Stack.Screen name='notes' options={{ headerShown: false }} />
      <Stack.Screen name='note' options={{ headerShown: false }} />
      <Stack.Screen name='highlights' options={{ headerShown: false }} />
      <Stack.Screen name='settings' options={{ headerShown: false }} />
      <Stack.Screen name='searchcapter' options={{ headerShown: false }} />
      <Stack.Screen name='searchbuttonwork' options={{ headerShown: false }} />
    </Stack>
  )
}
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useChat } from '@/lib/context/ChatContext';
import { SocketStatus } from '@/lib/hooks/useChatStream';
import { ChatProvider } from '@/lib/context/ChatContext';

function ConnectionStatus() {
  const { socketStatus }: { socketStatus: SocketStatus } = useChat();
  const color = {
    connecting: '#F59E0B',
    open: '#10B981',
    closed: '#EF4444',
  }[socketStatus];

  const statusText = {
    connecting: 'Connecting...',
    open: 'Connected',
    closed: 'Disconnected',
  }[socketStatus];

  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginRight: 15,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.05)'
    }}>
      <View style={{ 
        width: 8, 
        height: 8, 
        borderRadius: 4, 
        backgroundColor: color, 
        marginRight: 6 
      }} />
      <Text style={{ fontSize: 12, color: '#666', fontWeight: '500' }}>
        {statusText}
      </Text>
    </View>
  );
}

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ChatProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Chat',
            tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
            headerRight: () => <ConnectionStatus />,
          }}
        />
        <Tabs.Screen
          name="results"
          options={{
            title: 'Results',
            tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} />,
          }}
        />
      </Tabs>
    </ChatProvider>
  );
}

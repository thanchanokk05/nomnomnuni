import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  query: string;
  height?: number;
}

function embedUrl(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}

export default function RestaurantMap({ query, height = 200 }: Props) {
  if (!query.trim()) return null;
  return (
    <View style={[styles.wrap, { height }]}>
      <WebView
        source={{ uri: embedUrl(query) }}
        style={{ flex: 1 }}
        scrollEnabled={false}
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F1F5F9',
  },
});

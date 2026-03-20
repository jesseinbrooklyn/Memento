import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing } from '../../theme/tokens';
import { DailyQuote } from '../../components/DailyQuote';
import { MementoButton } from '../../components/MementoButton';
import { getTodaysQuote } from '../../utils/dailyContent';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MorningQuote'>;

interface Props {
  navigation: NavigationProp;
}

export const MorningQuoteScreen: React.FC<Props> = ({ navigation }) => {
  const quote = getTodaysQuote();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <DailyQuote quote={quote} showContext={true} />
      </View>
      <View style={styles.footer}>
        <MementoButton label="CONTINUE" onPress={() => navigation.navigate('MorningIntention')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
});

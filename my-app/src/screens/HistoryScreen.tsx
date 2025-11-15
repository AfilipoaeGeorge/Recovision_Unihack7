import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing, typography } from '../../res';
import { ColorPalette } from '../../res/colors';
import { ScreenHeader } from '../../components/ScreenHeader';
import { RootStackParamList } from '../navigation/types';
import { surgeries } from '../data/surgeries';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../hooks/useTranslation';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export function HistoryScreen({ navigation }: Props) {
  const t = useTranslation();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const gradientStops = useMemo(
    () => [colors.background, colors.surface, colors.card],
    [colors],
  );

  const translateStatus = (status: string) => {
    if (status === 'Completed') {
      return t('surgery.status.completed');
    }
    if (status.startsWith('Recovery - week')) {
      const week = status.replace('Recovery - week ', '');
      return `${t('surgery.status.recoveryWeek')} ${week}`;
    }
    return status;
  };

  return (
    <LinearGradient
      style={styles.gradient}
      colors={gradientStops}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title={t('history.title')}
            subtitle={t('history.subtitle')}
            onBack={() => navigation.goBack()}
          />
          <View style={styles.timeline}>
            {surgeries.map((surgery, index) => {
              // Use translation key directly from data structure
              const translatedTitle = t(surgery.titleKey as any);
              return (
                <View key={surgery.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={styles.dot} />
                    {index < surgeries.length - 1 && (
                      <View style={styles.connector} />
                    )}
                  </View>
                  <Pressable
                    style={styles.card}
                    onPress={() => navigation.navigate('SurgeryDetails', { id: surgery.id })}
                  >
                    <Text style={styles.cardTitle}>{translatedTitle}</Text>
                    <Text style={styles.cardMeta}>
                      {surgery.date} · {surgery.doctor}
                    </Text>
                    <Text style={styles.status}>{translateStatus(surgery.status)}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.xl,
      gap: spacing.xl,
    },
    timeline: {
      gap: spacing.lg,
      paddingRight: spacing.md,
    },
    timelineItem: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    timelineLeft: {
      alignItems: 'center',
    },
    dot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: colors.primaryMuted,
      marginTop: spacing.sm,
    },
    connector: {
      width: 2,
      flex: 1,
      backgroundColor: colors.primaryMuted,
    },
    card: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.lg,
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: colors.primaryMuted,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: typography.weight.semibold as any,
    },
    cardMeta: {
      color: colors.textSecondary,
      fontSize: typography.body,
    },
    status: {
      color: colors.accent,
      fontSize: typography.subtitle,
      fontWeight: typography.weight.medium as any,
    },
  });



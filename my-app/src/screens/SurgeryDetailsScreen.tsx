import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing } from '../../res';
import { ColorPalette } from '../../res/colors';
import { ScreenHeader } from '../../components/ScreenHeader';
import { RootStackParamList } from '../navigation/types';
import { getSurgeryById } from '../data/surgeries';
import { SurgeryDetailView } from '../../components/SurgeryDetailView';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../hooks/useTranslation';

type Props = NativeStackScreenProps<RootStackParamList, 'SurgeryDetails'>;

export function SurgeryDetailsScreen({ navigation, route }: Props) {
  const t = useTranslation();
  const surgery = useMemo(() => getSurgeryById(route.params.id), [route.params.id]);
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const gradientStops = useMemo(
    () => [colors.background, colors.surface, colors.card],
    [colors],
  );

  // Use translation key directly from data structure
  const translatedTitle = surgery ? t(surgery.titleKey as any) : null;

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
            title={translatedTitle ?? t('surgery.details.title')}
            subtitle={
              surgery
                ? `${t('surgery.details.performedOn')} ${surgery.date} by ${surgery.doctor}.`
                : t('surgery.details.notFound')
            }
            onBack={() => navigation.goBack()}
          />

          {surgery ? (
            <SurgeryDetailView surgery={surgery} scarImages={surgery.scarImages} />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {t('surgery.details.notFoundMessage')}
              </Text>
            </View>
          )}
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
    emptyState: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.primaryMuted,
    },
    emptyText: {
      color: colors.textSecondary,
    },
  });



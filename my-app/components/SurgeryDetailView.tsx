import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { spacing, typography } from '../res';
import { ColorPalette } from '../res/colors';
import { Surgery } from '../src/data/surgeries';
import { useThemeColors } from '../src/hooks/useThemeColors';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  surgery: Surgery;
  scarImages: string[];
  onUploadPress?: () => void;
  onDeleteScar?: (uri: string) => void;
  showUploadButton?: boolean;
};

export function SurgeryDetailView({
  surgery,
  scarImages,
  onUploadPress,
  onDeleteScar,
  showUploadButton,
}: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{surgery.title}</Text>
          <Text style={styles.cardDate}>{surgery.date}</Text>
        </View>
        <Text style={styles.cardDoctor}>Lead doctor: {surgery.doctor}</Text>
        <Text style={styles.sectionLabel}>Post-op status</Text>
        <Text style={styles.description}>{surgery.description}</Text>
        <Text style={styles.sectionLabel}>Treatment plan</Text>
        <View style={styles.treatmentList}>
          {surgery.treatments.map((treatment, index) => (
            <View key={`${surgery.id}-${index}`} style={styles.treatmentItem}>
              <View style={styles.treatmentIndicator} />
              <View style={styles.treatmentInfo}>
                <Text style={styles.treatmentName}>{treatment.name}</Text>
                <Text style={styles.treatmentMeta}>
                  {treatment.dosage} · {treatment.schedule}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Scar tracking</Text>
        <Text style={styles.cardDoctor}>
          Keep visual evidence of how the incision heals over time.
        </Text>
        <View style={styles.imageGrid}>
          {scarImages.map((uri, index) => (
            <View key={`${uri}-${index}`} style={styles.imageWrapper}>
              <View style={styles.imageHeader}>
                <Text style={styles.imageOrder}>#{index + 1}</Text>
                {onDeleteScar ? (
                  <Text style={styles.deleteText} onPress={() => onDeleteScar(uri)}>
                    Delete
                  </Text>
                ) : null}
              </View>
              <Image source={{ uri }} style={styles.imagePreview} />
              <Text style={styles.imageCaption}>Tap to enlarge</Text>
            </View>
          ))}
        </View>
        {showUploadButton && onUploadPress ? (
          <PrimaryButton label="Upload new scar photo" onPress={onUploadPress} />
        ) : null}
      </View>
    </>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 28,
      padding: spacing.lg,
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.primaryMuted,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.sm,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: typography.weight.semibold as any,
      flex: 1,
    },
    cardDate: {
      color: colors.textSecondary,
      fontSize: typography.caption,
    },
    cardDoctor: {
      color: colors.textSecondary,
      fontSize: typography.subtitle,
    },
    sectionLabel: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
    },
    description: {
      color: colors.textPrimary,
      fontSize: typography.body,
      lineHeight: 20,
    },
    treatmentList: {
      gap: spacing.sm,
    },
    treatmentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: 16,
    },
    treatmentIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.accent,
    },
    treatmentInfo: {
      flex: 1,
    },
    treatmentName: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: typography.weight.medium as any,
    },
    treatmentMeta: {
      color: colors.textSecondary,
      fontSize: typography.caption,
    },
    imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    imageWrapper: {
      width: '47%',
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: spacing.sm,
      gap: spacing.xs,
    },
    imageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    imageOrder: {
      color: colors.textSecondary,
      fontSize: typography.caption,
    },
    deleteText: {
      color: colors.danger,
      fontSize: typography.caption,
      fontWeight: typography.weight.semibold as any,
    },
    imagePreview: {
      width: '100%',
      height: 140,
      borderRadius: 12,
    },
    imageCaption: {
      color: colors.accent,
      fontSize: typography.caption,
    },
  });



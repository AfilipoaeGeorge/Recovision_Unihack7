import tensorflow as tf
import matplotlib.pyplot as plt
import os
import numpy as np

DATA_DIR = "dataset_augmented"
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 8
NUM_CLASSES = 5
EPOCHS = 150

print(f"[INFO] Incarc datele din: {DATA_DIR}")

train_dataset = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.3,
    subset="training",
    seed=42,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='int' 
)

val_test_dataset = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.3,
    subset="validation",
    seed=42,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='int'
)

val_test_batches = tf.data.experimental.cardinality(val_test_dataset)
val_batches = val_test_batches // 2
validation_dataset = val_test_dataset.take(val_batches)
test_dataset = val_test_dataset.skip(val_batches)

class_names = train_dataset.class_names
print(f"[INFO] Clasele gasite: {class_names}")

print(f"[INFO] Impartire date finalizata:")
print(f"  {tf.data.experimental.cardinality(train_dataset)} batch-uri de antrenare (70%)")
print(f"  {tf.data.experimental.cardinality(validation_dataset)} batch-uri de validare (15%)")
print(f"  {tf.data.experimental.cardinality(test_dataset)} batch-uri de test (15%)")

AUTOTUNE = tf.data.AUTOTUNE
train_dataset = train_dataset.cache().prefetch(buffer_size=AUTOTUNE)
validation_dataset = validation_dataset.cache().prefetch(buffer_size=AUTOTUNE)
test_dataset = test_dataset.cache().prefetch(buffer_size=AUTOTUNE)

data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip('horizontal'),
    tf.keras.layers.RandomFlip('vertical'),
    tf.keras.layers.RandomRotation(0.3),
    tf.keras.layers.RandomZoom(0.3),
    tf.keras.layers.RandomTranslation(0.2, 0.2),
    tf.keras.layers.RandomContrast(0.3),
    tf.keras.layers.RandomBrightness(0.3),
    tf.keras.layers.GaussianNoise(0.1),
])

preprocess_input = tf.keras.applications.mobilenet_v2.preprocess_input

base_model = tf.keras.applications.MobileNetV2(
    input_shape=IMAGE_SIZE + (3,),
    include_top=False,
    weights='imagenet'
)

base_model.trainable = True
for layer in base_model.layers[:-50]:
    layer.trainable = False

inputs = tf.keras.Input(shape=IMAGE_SIZE + (3,))
x = data_augmentation(inputs)
x = preprocess_input(x)
x = base_model(x, training=True) 
x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Dense(512, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.0001))(x)
x = tf.keras.layers.Dropout(0.5)(x)
x = tf.keras.layers.Dense(256, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.0001))(x)
x = tf.keras.layers.Dropout(0.4)(x)
x = tf.keras.layers.Dense(128, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.0001))(x)
x = tf.keras.layers.Dropout(0.3)(x)
outputs = tf.keras.layers.Dense(NUM_CLASSES, activation='softmax')(x)

model = tf.keras.Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

early_stop = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=15,
    restore_best_weights=True,
    verbose=1
)

reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=4,
    min_lr=0.00001,
    verbose=1
)

print("\n[INFO] Incep antrenarea...")

history = model.fit(
    train_dataset,
    epochs=EPOCHS,
    validation_data=validation_dataset,
    callbacks=[early_stop, reduce_lr],
    verbose=1
)

print("[INFO] Antrenare finalizata!")

model.save("cicatrici_model_70_30.keras")
print("[INFO] Modelul a fost salvat ca 'cicatrici_model_70_30.keras'")

with open("class_names.txt", "w") as f:
    for i, cls in enumerate(class_names):
        f.write(f"{i}: {cls}\n")
print(f"[INFO] Clasele salvate in 'class_names.txt': {class_names}")

print("\n[INFO] Evaluarea finala a modelului pe setul de TEST...")
test_loss, test_accuracy = model.evaluate(test_dataset)

print(f"\n[REZULTATE TEST]")
print(f"  Pierdere (Loss): {test_loss:.4f}")
print(f"  Acuratete (Accuracy): {test_accuracy * 100:.2f}%")

acc = history.history['accuracy']
val_acc = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']

epochs_range = range(len(acc))

plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Acuratete Antrenare (70%)')
plt.plot(epochs_range, val_acc, label='Acuratete Validare (15%)')
plt.legend(loc='lower right')
plt.title('Acuratetea Antrenarii si Validarii')
plt.xlabel('Epoci')
plt.ylabel('Acuratete')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Pierdere Antrenare (70%)')
plt.plot(epochs_range, val_loss, label='Pierdere Validare (15%)')
plt.legend(loc='upper right')
plt.title('Pierderea Antrenarii si Validarii')
plt.xlabel('Epoci')
plt.ylabel('Pierdere')

plt.suptitle(f'Rezultate Test: Acuratete {test_accuracy*100:.2f}% / Pierdere {test_loss:.4f}')
plt.savefig("rezultate_antrenare_70_30.png")
print("[INFO] Graficele au fost salvate ca 'rezultate_antrenare_70_30.png'")

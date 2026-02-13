import { Ref, watch, ComputedRef, computed, shallowRef } from 'vue'

export default function useMergedState<T> (
  controlledStateRef: Ref<T | undefined>,
  uncontrolledStateRef: Ref<T>
): ComputedRef<T | undefined> {
  // 追踪是否曾经进入受控模式
  const hasBeenControlled = shallowRef(false)

  watch(controlledStateRef, value => {
    if (value !== undefined) {
      hasBeenControlled.value = true
      // 仅当值不同时才同步，避免不必要的更新
      if (value !== uncontrolledStateRef.value) {
        uncontrolledStateRef.value = value
      }
    }
  }, { immediate: true })

  return computed(() => {
    const controlledValue = controlledStateRef.value
    if (controlledValue !== undefined) {
      return controlledValue
    }
    // 如果曾经受控过，undefined 也是有效值（表示清空）
    if (hasBeenControlled.value) {
      return undefined
    }
    // 从未受控，返回非受控值
    return uncontrolledStateRef.value
  })
}

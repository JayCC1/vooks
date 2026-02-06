import { Ref, watch, ComputedRef, computed, ref } from 'vue'

export default function useMergedState<T> (
  controlledStateRef: Ref<T | undefined>,
  uncontrolledStateRef: Ref<T>
): ComputedRef<T> {
  // 追踪 controlledStateRef 是否曾经有过非 undefined 的值
  const controlledRef = ref(controlledStateRef.value !== undefined)
  watch(controlledStateRef, value => {
    if (value !== undefined) {
      uncontrolledStateRef.value = value
      controlledRef.value = true
    }
  })
  return computed(() => {
    // 如果 controlledStateRef 曾经被设置过值，则始终使用 controlledStateRef 的值
    // 这样当 controlledStateRef 变回 undefined 时，返回的也是 undefined
    if (controlledRef.value) {
      return controlledStateRef.value as T
    }
    return uncontrolledStateRef.value
  })
}

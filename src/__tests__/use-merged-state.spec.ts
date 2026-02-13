import { nextTick, ref } from 'vue'
import { useMergedState } from '../index'

describe('# useMergedState', () => {
  it('should return uncontrolled value when never controlled', () => {
    const uncontrolledRef = ref(1)
    const controlledRef = ref<number | undefined>(undefined)
    const mergedRef = useMergedState(controlledRef, uncontrolledRef)
    expect(mergedRef.value).toEqual(1)
  })

  it('should return controlled value when controlled', () => {
    const uncontrolledRef = ref(1)
    const controlledRef = ref<number | undefined>(2)
    const mergedRef = useMergedState(controlledRef, uncontrolledRef)
    expect(mergedRef.value).toEqual(2)
  })

  it('should sync controlled value to uncontrolled ref', async () => {
    const uncontrolledRef = ref(1)
    const controlledRef = ref<number | undefined>(undefined)
    const mergedRef = useMergedState(controlledRef, uncontrolledRef)
    expect(mergedRef.value).toEqual(1)

    controlledRef.value = 2
    expect(mergedRef.value).toEqual(2)
    await nextTick()
    expect(uncontrolledRef.value).toEqual(2)
  })

  it('should return undefined when controlled value is set to undefined after being controlled', async () => {
    const uncontrolledRef = ref(1)
    const controlledRef = ref<number | undefined>(undefined)
    const mergedRef = useMergedState(controlledRef, uncontrolledRef)

    // 初始：从未受控，返回非受控值
    expect(mergedRef.value).toEqual(1)

    // 进入受控模式
    controlledRef.value = 2
    expect(mergedRef.value).toEqual(2)
    await nextTick()
    expect(uncontrolledRef.value).toEqual(2)

    // 关键：设置为 undefined 应该返回 undefined（清空），而不是旧的非受控值
    controlledRef.value = undefined
    expect(mergedRef.value).toEqual(undefined)
  })

  it('should handle initial controlled state correctly', () => {
    const uncontrolledRef = ref('default')
    const controlledRef = ref<string | undefined>('initial')
    const mergedRef = useMergedState(controlledRef, uncontrolledRef)

    expect(mergedRef.value).toEqual('initial')

    // 清空应该返回 undefined
    controlledRef.value = undefined
    expect(mergedRef.value).toEqual(undefined)
  })

  it('should work with empty string as valid controlled value', async () => {
    const uncontrolledRef = ref('default')
    const controlledRef = ref<string | undefined>(undefined)
    const mergedRef = useMergedState(controlledRef, uncontrolledRef)

    expect(mergedRef.value).toEqual('default')

    // 设置为空字符串
    controlledRef.value = ''
    expect(mergedRef.value).toEqual('')
    await nextTick()
    expect(uncontrolledRef.value).toEqual('')

    // 再设置为 undefined，应该返回 undefined（清空）
    controlledRef.value = undefined
    expect(mergedRef.value).toEqual(undefined)
  })
})

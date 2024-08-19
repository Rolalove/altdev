import { useSupabaseUser } from 'imports'
import { useRouter } from 'nuxt/app'

export const useAuthRedirect = () => {
  const user = useSupabaseUser()
  const router = useRouter()

  watch(user, (newUser) => {
    if (newUser) {
      router.push('/userdashboard')
    }
  }, { immediate: true })
}
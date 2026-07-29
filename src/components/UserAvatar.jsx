import { Avatar } from './Avatar'
import styles from '../styles/components/UserAvatar.module.css'

/**
 * `Avatar` (Etapa 4) com anel de status opcional.
 * @param {{ name: string, src?: string, size?: 'sm' | 'md' | 'lg', online?: boolean }} props
 */
function UserAvatar({ name, src, size = 'md', online = false }) {
  return (
    <span className={`${styles.wrapper} ${online ? styles.online : ''}`}>
      <Avatar name={name} src={src} size={size} />
    </span>
  )
}

export { UserAvatar }

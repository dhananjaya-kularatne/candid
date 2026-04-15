const AVATAR_COLORS = [
  { bg: '#EEEDFE', color: '#534AB7' }, // purple
  { bg: '#E1F5EE', color: '#0F6E56' }, // teal
  { bg: '#FAECE7', color: '#993C1D' }, // coral
  { bg: '#E6F1FB', color: '#185FA5' }, // blue
  { bg: '#FBEAF0', color: '#993556' }, // pink
]

function getAvatarStyle(username) {
  if (!username) return AVATAR_COLORS[0]
  const index = username.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}

function getInitials(name, username) {
  const display = name || username || '?'
  return display.charAt(0).toUpperCase()
}

export default function Avatar({ user, size = 32, className = '' }) {
  const style = getAvatarStyle(user?.username)
  const initials = getInitials(user?.name, user?.username)

  const sizeStyle = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    fontSize: size <= 28 ? 11 : 12,
  }

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.username}
        style={{ ...sizeStyle, borderRadius: '50%', objectFit: 'cover' }}
        className={className}
      />
    )
  }

  return (
    <div
      style={{
        ...sizeStyle,
        borderRadius: '50%',
        backgroundColor: style.bg,
        color: style.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        flexShrink: 0,
      }}
      className={className}
    >
      {initials}
    </div>
  )
}

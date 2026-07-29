import { Tabs } from '@heroui/react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import type { FC } from 'react'

const themes = [
  { key: 'light', icon: Sun },
  { key: 'dark', icon: Moon },
  { key: 'system', icon: Monitor },
]

const ThemeToggle: FC = () => {
  const { theme, setTheme } = useTheme()
  return (
    <Tabs className="fixed top-3 right-3 z-50 hidden sm:block" selectedKey={theme} onSelectionChange={key => setTheme(key as string)}>
      <Tabs.ListContainer>
        <Tabs.List aria-label="ThemeToggle" className="*:px-1 *:h-6">
          {themes.map(({ key, icon: Icon }) => (
            <Tabs.Tab id={key} key={key}>
              <Icon className="size-3.5" fill="currentColor" />
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  )
}
export default ThemeToggle

import type { FC } from 'react'
import { Display, Moon, Sun } from '@gravity-ui/icons'
import { Tabs } from '@heroui/react'
import { useTheme } from 'next-themes'

const ThemeToggle: FC = () => {
  const { theme, setTheme } = useTheme()
  return (
    <Tabs className="fixed top-3 right-3 z-50" selectedKey={theme} onSelectionChange={key => setTheme(key as string)}>
      <Tabs.ListContainer>
        <Tabs.List aria-label="ThemeToggle" className="*:px-2">
          <Tabs.Tab id="light">
            <Sun />
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="dark">
            <Moon />
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="system">
            <Display />
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  )
}
export default ThemeToggle

//@flow

import React, {useState, useEffect} from 'react'
import {combine} from 'effector'
import {createComponent} from 'effector-react'
import debounce from 'lodash.debounce'

import 'codemirror/lib/codemirror.css'
import './styles.css'
import {SidebarHeader} from './components/SidebarHeader'
import Panel from './components/CodeMirrorPanel'
import Errors from './components/Errors'
import SecondanaryTabs from './components/SecondanaryTabs'
import Outline from './components/Outline'
import {TypeHintView} from './flow/view'
import {isDesktopChanges, tab} from './tabs/domain'
import {TabsView} from './tabs/view'
import {PrettifyButton} from './settings/view'
import {mode} from './mode/domain'
import {
  performLint,
  changeSources,
  codeSetCursor,
  codeCursorActivity,
  codeMarkLine,
} from './editor'
import {sourceCode, codeError} from './editor/state'

import {stats} from './realm/state'
import Sizer from './components/Sizer'

const OutlineView = createComponent(
  {
    displayOutline: combine(tab, isDesktopChanges, (tab, isDesktop) =>
      isDesktop ? true : tab === 'outline',
    ),
    stats,
  },
  ({}, {displayOutline, stats}) => (
    <Outline
      style={{visibility: displayOutline ? 'visible' : 'hidden'}}
      {...stats}
    />
  ),
)

const ErrorsView = createComponent(
  codeError,
  ({}, {isError, error, stackFrames}) => (
    <Errors isError={isError} error={(error: any)} stackFrames={stackFrames} />
  ),
)

const changeSourcesDebounced = debounce(changeSources, 500)
const CodeView = createComponent(
  {
    displayEditor: combine(tab, isDesktopChanges, (tab, isDesktop) =>
      isDesktop ? true : tab === 'editor',
    ),
    sourceCode,
    mode,
  },
  ({}, {displayEditor, mode, sourceCode}) => {
    const [outlineSidebar, setOutlineSidebar] = useState(null)
    const [consolePanel, setConsolePanel] = useState(null)

    useEffect(() => {
      setOutlineSidebar(document.getElementById('outline-sidebar'))
      setConsolePanel(document.getElementById('console-panel'))
    }, [])

    return (
      <div
        className="sources"
        style={{
          visibility: displayEditor ? 'visible' : 'hidden',
          display: 'flex',
        }}>
        <Sizer
          direction="vertical"
          container={outlineSidebar}
          cssVar="--outline-width"
          sign={1}
        />

        <div className="sources" style={{flex: '1 0 auto'}}>
          <Panel
            markLine={codeMarkLine}
            setCursor={codeSetCursor}
            performLint={performLint}
            onCursorActivity={codeCursorActivity}
            value={sourceCode}
            mode={mode}
            onChange={changeSourcesDebounced}
            lineWrapping
            passive
          />
          <TypeHintView />
        </div>

        <Sizer
          direction="vertical"
          container={consolePanel}
          cssVar="--right-panel-width"
          sign={-1}
        />
      </div>
    )
  },
)

export default (
  <>
    <OutlineView />
    <CodeView />
    <SidebarHeader>
      <PrettifyButton />
    </SidebarHeader>
    <TabsView />
    <SecondanaryTabs />
    <ErrorsView />
  </>
)

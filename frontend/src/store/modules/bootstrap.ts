import {Component, PropType} from 'vue'
import {defineStore} from "pinia"
import {store} from "/@/store"
import {mapValues, uniq} from 'lodash-es'
import invalidateCommands from '/@/second/commands/invalidateCommands'
import {IPinnedDatabasesItem} from '/@/second/typings/types/standard.d'
import {ExtensionsDirectory} from '/@/second/typings/types/extensions.d'

interface IVariableBasic {
  openedConnections: string[]
  currentDatabase: Nullable<IPinnedDatabasesItem>,
  extensions: Nullable<ExtensionsDirectory>
  currentDropDownMenu: Nullable<ICurrentDropDownMenu>
  commands: object
  commandsSettings: object
  visibleCommandPalette: Nullable<unknown>
  commandsCustomized: object
  loadingPluginStore: { loaded: boolean, loadingPackageName: Nullable<string> }
  connections: []
  databases: []
  selectedCellsCallback: Nullable<() => any>
  openedSingleDatabaseConnections: string[]
  expandedConnections: string[]
}

export interface TabDefinition {
  title: string;
  closedTime?: number;
  icon: string;
  props: any;
  selected: boolean;
  busy: boolean;
  tabid: string;
  tabComponent: PropType<string | Component>;
  tabOrder?: number;
}

export interface ICurrentDropDownMenu {
  left: number
  top: number
  items: any[]
  targetElement?: HTMLElement
}

let visibleCommandPaletteValue = null
let openedConnectionsValue: Nullable<any> = null
export const getOpenedConnections = () => openedConnectionsValue;
export const useBootstrapStore = defineStore({
  id: "app-bootstrap",
  state: (): IVariableBasic => ({
    currentDatabase: null,
    openedConnections: [],
    openedSingleDatabaseConnections: [],
    expandedConnections: [],
    extensions: null,
    currentDropDownMenu: null,
    commands: {},
    commandsSettings: {},
    visibleCommandPalette: null,
    commandsCustomized: {},
    loadingPluginStore: {
      loaded: false,
      loadingPackageName: null
    },
    connections: [],
    databases: [],
    selectedCellsCallback: null,
  }),
  getters: {
    getOpenedConnections(): string[] {
      return this.openedConnections
    },
    getCurrentDatabase(): Nullable<IPinnedDatabasesItem> {
      return this.currentDatabase
    },
    getPinnedExtensions(): Nullable<ExtensionsDirectory> {
      return this.extensions
    },
    getCommandsCustomized(): any[] {
      return mapValues([this.commands, this.commandsSettings], (v, k) => ({
        // @ts-ignore
        ...v,
        ...this.commandsSettings[k]
      }))
    }
  },
  actions: {
    setOpenedConnections(value: string[]) {
      this.openedConnections = value
    },
    removeCurrentDatabase(deleteId) {
      if (this.currentDatabase && this.currentDatabase.connection._id == deleteId) {
        this.setCurrentDatabase(null)
      }
    },
    setCurrentDatabase(value: Nullable<IPinnedDatabasesItem>) {
      this.currentDatabase = value
      if (value?.connection?._id) {
        if (value?.connection?.singleDatabase) {
          this.openedSingleDatabaseConnections = uniq([...this.openedSingleDatabaseConnections, value?.connection?._id])
        } else {
          this.openedConnections = uniq([...this.openedConnections, value?.connection?._id])
          this.expandedConnections = uniq([...this.expandedConnections, value?.connection?._id])
          openedConnectionsValue = this.openedConnections
        }
      }
    },
    setExtensions(value: ExtensionsDirectory) {
      this.extensions = value
    },
    setCurrentDropDownMenu(value: null | ICurrentDropDownMenu) {
      this.currentDropDownMenu = value
    },
    setCommandPalette(value) {
      visibleCommandPaletteValue = value
      console.log(visibleCommandPaletteValue)
      void invalidateCommands()
    },
    setVisibleCommandPalette(value: Nullable<unknown>) {
      this.visibleCommandPalette = value
    },
    setCommands(value: object) {
      this.commands = value
      this.commandsCustomized = derived(this.commands, this.commandsSettings)
    },
    setCommandsSettings(value: object) {
      this.commandsSettings = value
      this.commandsCustomized = derived(this.commands, this.commandsSettings)
    },
    setLoadingPluginStore(value: { loaded: boolean, loadingPackageName: Nullable<string> }) {
      this.loadingPluginStore = value
    },
    setConnections(payload): void {
      this.connections = payload
    },
    setSelectedCellsCallback(value: () => any) {
      this.selectedCellsCallback = value
    },
    updateExpandedConnections(updater) {
      this.expandedConnections = updater(this.expandedConnections)
    }
  }
});

export function useBootstrapStoreWithOut() {
  return useBootstrapStore(store);
}

const derived = (commands, commandsSettings): object => {
  return mapValues(commands, (v, k) => ({
    ...v,
    ...commandsSettings[k]
  }))
}

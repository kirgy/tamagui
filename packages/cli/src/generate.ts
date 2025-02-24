#!/usr/bin/env node

import { CLIResolvedOptions } from '@tamagui/types'
import fs from 'fs-extra'
import { Project } from 'ts-morph'

import { loadTamagui } from './utils.js'

export async function generateTypes(options: CLIResolvedOptions) {
  const types = await getTypes(options)
  await fs.writeJSON(options.paths.types, types, {
    spaces: 2,
  })
}

export async function getTypes(options: CLIResolvedOptions) {
  const tamagui = await loadTamagui(options.tamaguiOptions)

  if (!tamagui) {
    throw new Error(`No tamagui config`)
  }

  const uniqueViewExportingPaths = new Set(
    Object.keys(tamagui.nameToPaths).map((name) => {
      return `${[...tamagui.nameToPaths[name]][0]}.ts*`
    })
  )

  const project = new Project({
    compilerOptions: {
      noEmit: false,
      declaration: true,
      emitDeclarationOnly: true,
    },
    skipAddingFilesFromTsConfig: true,
    tsConfigFilePath: options.tsconfigPath,
  })

  const files = project.addSourceFilesAtPaths([...uniqueViewExportingPaths])

  return Object.fromEntries(
    files.flatMap((x) => {
      return [...x.getExportedDeclarations()].map(([k, v]) => {
        return [
          k,
          v[0]
            .getType()
            .getApparentType()
            .getProperties()
            .map((prop) => {
              return [
                prop.getEscapedName(),
                prop.getValueDeclaration()?.getType().getText(),
              ]
            }),
        ]
      })
    })
  )

  // console.log(
  //   'project',
  //   files.map((x) => x.getFilePath()),
  //   files.map((x) => {
  //     return x.getExportedDeclarations()
  //   }),
  //   Object.fromEntries(
  //     files.flatMap((x) => {
  //       return [...x.getExportedDeclarations()].map(([k, v]) => {
  //         return [k, v[0].getType().getApparentType().getText()]
  //       })
  //     })
  //   ),

  //   // files.map((f) => f.getExportSymbols())
}

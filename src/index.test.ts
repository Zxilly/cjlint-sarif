import { describe, it, expect } from 'vitest'
import { convert } from './index'
import { CangjieResult } from './types'
import { Log, ReportingDescriptor, Result } from 'sarif'

describe('convertToSarif', () => {
  it('should convert empty input to valid SARIF format', () => {
    const result = convert([])
    expect(result.version).toBe('2.1.0')
    expect(result.$schema).toBe('https://json.schemastore.org/sarif-2.1.0.json')
    expect(result.runs[0].results).toHaveLength(0)
    expect(result.runs[0].tool.driver.rules).toHaveLength(0)
  })

  it('should handle multiple wildcard import warnings correctly', () => {
    const input: CangjieResult[] = [
      {
        file: 'T:\\tcj\\src\\main.cj',
        line: 3,
        column: 8,
        endLine: 3,
        endColumn: 17,
        analyzerName: 'cangjieCodeCheck',
        description: 'G.PKG.01: Avoid using the wildcard \'*\' in the import declaration \'std.ast\'.',
        defectLevel: 'SUGGESTIONS',
        defectType: 'G_PKG_01_avoid_wildcard',
        language: 'cangjie'
      },
      {
        file: 'T:\\tcj\\src\\main.cj',
        line: 4,
        column: 8,
        endLine: 4,
        endColumn: 20,
        analyzerName: 'cangjieCodeCheck',
        description: 'G.PKG.01: Avoid using the wildcard \'*\' in the import declaration \'std.argopt\'.',
        defectLevel: 'SUGGESTIONS',
        defectType: 'G_PKG_01_avoid_wildcard',
        language: 'cangjie'
      }
    ]

    const result = convert(input)
    
    
    const rules = result.runs[0].tool.driver.rules as ReportingDescriptor[]
    expect(rules).toHaveLength(1)
    expect(rules[0]?.id).toBe('G_PKG_01_avoid_wildcard')
    expect(rules[0]?.shortDescription?.text).toBe('G.PKG.01: Avoid using the wildcard \'*\' in the import declaration \'std.ast\'.')
    expect(rules[0]?.defaultConfiguration?.level).toBe('note')


    const results = result.runs[0].results as Result[]
    expect(results).toHaveLength(2)
    results.forEach(r => {
      expect(r.level).toBe('note')
      expect(r.ruleId).toBe('G_PKG_01_avoid_wildcard')
    })
  })

  it('should handle hardcoded IP error correctly', () => {
    const input: CangjieResult[] = [
      {
        file: 'T:\\tcj\\src\\main.cj',
        line: 7,
        column: 8,
        endLine: 7,
        endColumn: 15,
        analyzerName: 'cangjieCodeCheck',
        description: 'G.OTH.03: 1.2.3.4 is public ip, hard-coded in the program',
        defectLevel: 'MANDATORY',
        defectType: 'G_OTH_03_public_ip_hardcode_information',
        language: 'cangjie'
      }
    ]

    const result = convert(input)
    
    const rules = result.runs[0].tool.driver.rules as ReportingDescriptor[]
    expect(rules).toHaveLength(1)
    expect(rules[0]?.id).toBe('G_OTH_03_public_ip_hardcode_information')
    expect(rules[0]?.defaultConfiguration?.level).toBe('error')

    const results = result.runs[0].results as Result[]
    expect(results).toHaveLength(1)
    expect(results[0].level).toBe('error')
    expect(results[0].message.text).toBe('G.OTH.03: 1.2.3.4 is public ip, hard-coded in the program')
  })

  it('should handle naming convention suggestion correctly', () => {
    const input: CangjieResult[] = [
      {
        file: 'T:\\tcj\\src\\main.cj',
        line: 14,
        column: 1,
        endLine: 20,
        endColumn: 2,
        analyzerName: 'cangjieCodeCheck',
        description: 'G.NAM.03: Identifier \'test\' recommend to use upper camel case for interface, class, struct, enumeration type, enumeration member construction, type alias',
        defectLevel: 'SUGGESTIONS',
        defectType: 'G_NAM_03_identifier_naming_information',
        language: 'cangjie'
      }
    ]

    const result = convert(input)
    
    const rules = result.runs[0].tool.driver.rules as ReportingDescriptor[]
    expect(rules).toHaveLength(1)
    expect(rules[0]?.id).toBe('G_NAM_03_identifier_naming_information')
    expect(rules[0]?.defaultConfiguration?.level).toBe('note')

    const results = result.runs[0].results as Result[]
    expect(results).toHaveLength(1)
    expect(results[0].level).toBe('note')
    expect(results[0].locations?.[0]?.physicalLocation?.region).toEqual({
      startLine: 14,
      startColumn: 1,
      endLine: 20,
      endColumn: 2
    })
  })

  it('should handle all rules together correctly', () => {
    const input: CangjieResult[] = [
      {
        file: 'T:\\tcj\\src\\main.cj',
        line: 3,
        column: 8,
        endLine: 3,
        endColumn: 17,
        analyzerName: 'cangjieCodeCheck',
        description: 'G.PKG.01: Avoid using the wildcard \'*\' in the import declaration \'std.ast\'.',
        defectLevel: 'SUGGESTIONS',
        defectType: 'G_PKG_01_avoid_wildcard',
        language: 'cangjie'
      },
      {
        file: 'T:\\tcj\\src\\main.cj',
        line: 4,
        column: 8,
        endLine: 4,
        endColumn: 20,
        analyzerName: 'cangjieCodeCheck',
        description: 'G.PKG.01: Avoid using the wildcard \'*\' in the import declaration \'std.argopt\'.',
        defectLevel: 'SUGGESTIONS',
        defectType: 'G_PKG_01_avoid_wildcard',
        language: 'cangjie'
      },
      {
        file: 'T:\\tcj\\src\\main.cj',
        line: 7,
        column: 8,
        endLine: 7,
        endColumn: 15,
        analyzerName: 'cangjieCodeCheck',
        description: 'G.OTH.03: 1.2.3.4 is public ip, hard-coded in the program',
        defectLevel: 'MANDATORY',
        defectType: 'G_OTH_03_public_ip_hardcode_information',
        language: 'cangjie'
      },
      {
        file: 'T:\\tcj\\src\\main.cj',
        line: 14,
        column: 1,
        endLine: 20,
        endColumn: 2,
        analyzerName: 'cangjieCodeCheck',
        description: 'G.NAM.03: Identifier \'test\' recommend to use upper camel case for interface, class, struct, enumeration type, enumeration member construction, type alias',
        defectLevel: 'SUGGESTIONS',
        defectType: 'G_NAM_03_identifier_naming_information',
        language: 'cangjie'
      }
    ]

    const result = convert(input)

    const rules = result.runs[0].tool.driver.rules as ReportingDescriptor[]
    expect(rules).toHaveLength(3)
    const ruleIds = rules.map(r => r.id).sort()
    expect(ruleIds).toEqual([
      'G_NAM_03_identifier_naming_information',
      'G_OTH_03_public_ip_hardcode_information',
      'G_PKG_01_avoid_wildcard'
    ])

    const results = result.runs[0].results as Result[]
    expect(results).toHaveLength(4)

    results.forEach(r => {
      expect(r.locations?.[0]?.physicalLocation?.artifactLocation?.uri)
        .toBe('tcj/src/main.cj')
    })

    const wildcardResults = results.filter(r => r.ruleId === 'G_PKG_01_avoid_wildcard')
    expect(wildcardResults).toHaveLength(2)
    wildcardResults.forEach(r => {
      expect(r.level).toBe('note')
    })

    const hardcodeResult = results.find(r => r.ruleId === 'G_OTH_03_public_ip_hardcode_information')
    expect(hardcodeResult?.level).toBe('error')

    const namingResult = results.find(r => r.ruleId === 'G_NAM_03_identifier_naming_information')
    expect(namingResult?.level).toBe('note')
  })
}) 
package org.irods.jargon.idrop.web.services

import org.irods.jargon.core.connection.IRODSAccount
import org.irods.jargon.core.pub.IRODSAccessObjectFactory



/**
 * Service to manage rule editing via the rule workbench and management of the delay exec queue
 * @author Mike Conway - DICE
 *
 */
class RuleWorkbenchService {

	IRODSAccessObjectFactory irodsAccessObjectFactory
	JargonServiceFactoryService jargonServiceFactoryService

	static transactional = false

	/**
	 * Load the iRODS rule at the given path
	 * @param irodsAbsolutePath
	 * @param irodsAccount
	 * @return
	 */
	def loadRuleFromIrods(String irodsAbsolutePath, IRODSAccount irodsAccount) {
		log.info("loadRuleFromIrods()")

		if (!irodsAccount) {
			throw new IllegalArgumentException("null irodsAccount")
		}

		if (!irodsAbsolutePath) {
			throw new IllegalArgumentException("null or empty irodsAbsolutePath")
		}
		log.info("irodsAbsolutePath for rule:${irodsAbsolutePath}")

		def ruleCompositionService = jargonServiceFactoryService.instanceRuleCompositionService(irodsAccount)
		return ruleCompositionService.loadRuleFromIrods(irodsAbsolutePath)
	}

	/**
	 * Store a rule from its constituent parts
	 * @param ruleAbsolutePath
	 * @param ruleBody
	 * @param inputParameters
	 * @param outputParameters
	 * @param irodsAccount
	 * @return
	 */
	def storeRuleFromParts( String ruleAbsolutePath,
			String ruleBody,   List inputParameters,
			List outputParameters,  IRODSAccount irodsAccount) {

		log.info("storeRuleFromParts()")
		if (ruleAbsolutePath == null || ruleAbsolutePath.isEmpty()) {
			throw new IllegalArgumentException("null or empty ruleAbsolutePath")
		}

		if (ruleBody == null || ruleBody.isEmpty()) {
			throw new IllegalArgumentException("null or empty ruleBody")
		}

		if (inputParameters == null) {
			throw new IllegalArgumentException("null inputParameters")
		}

		if (outputParameters == null) {
			throw new IllegalArgumentException("null outputParameters")
		}

		if (!irodsAccount) {
			throw new IllegalArgumentException("null irodsAccount")
		}

		log.info("ruleAbsolutePath:${ruleAbsolutePath}")
		log.info("inputParameters:${inputParameters}")
		log.info("outputParameters:${outputParameters}")

		def ruleCompositionService = jargonServiceFactoryService.instanceRuleCompositionService(irodsAccount)
		return ruleCompositionService.storeRuleFromParts(ruleAbsolutePath, ruleBody, inputParameters, outputParameters)
	}
}

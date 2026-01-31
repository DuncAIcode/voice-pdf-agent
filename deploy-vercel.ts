/**
 * Programmatic Vercel Deployment using TypeScript SDK
 * 
 * This script uses the @vercel/sdk to programmatically deploy
 * the PDF Automation Agent to Vercel.
 * 
 * Based on Vercel SDK documentation from Context7
 * 
 * Setup:
 * 1. npm install @vercel/sdk
 * 2. Set VERCEL_TOKEN environment variable
 * 3. Run: npx tsx deploy-vercel.ts
 */

import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
    bearerToken: process.env.VERCEL_TOKEN,
});

interface DeploymentConfig {
    projectName: string;
    repoOwner: string;
    repoName: string;
    teamId?: string;
    backendUrl: string;
}

async function deployToVercel(config: DeploymentConfig) {
    console.log('🚀 Starting Vercel deployment...\n');

    try {
        // Step 1: Create or get existing project
        console.log('📦 Creating/linking Vercel project...');
        const createResponse = await vercel.projects.createProject({
            requestBody: {
                name: config.projectName,
                framework: 'nextjs',
                gitRepository: {
                    repo: `${config.repoOwner}/${config.repoName}`,
                    type: 'github',
                },
                rootDirectory: 'frontend',
                buildCommand: 'npm run build',
                outputDirectory: '.next',
                installCommand: 'npm install',
                devCommand: 'npm run dev',
            },
            ...(config.teamId && { teamId: config.teamId }),
        });

        console.log(`✅ Project created: ${createResponse.id}\n`);

        // Step 2: Add environment variables
        console.log('⚙️ Configuring environment variables...');
        await vercel.projects.createProjectEnv({
            idOrName: createResponse.id,
            upsert: 'true',
            requestBody: [
                {
                    key: 'NEXT_PUBLIC_API_URL',
                    value: config.backendUrl,
                    type: 'plain',
                    target: ['production', 'preview'],
                },
            ],
            ...(config.teamId && { teamId: config.teamId }),
        });

        console.log('✅ Environment variables configured\n');

        // Step 3: Trigger deployment
        console.log('🚀 Triggering deployment...');
        const deployment = await vercel.deployments.createDeployment({
            requestBody: {
                name: config.projectName,
                gitSource: {
                    type: 'github',
                    ref: 'main',
                    repoId: createResponse.id,
                },
                target: 'production',
                projectSettings: {
                    framework: 'nextjs',
                    buildCommand: 'npm run build',
                    outputDirectory: '.next',
                    rootDirectory: 'frontend',
                },
            },
            ...(config.teamId && { teamId: config.teamId }),
        });

        console.log(`✅ Deployment initiated: ${deployment.id}`);
        console.log(`🔗 URL: https://${deployment.url}`);
        console.log(`🔍 Inspect: ${deployment.inspectorUrl}\n`);

        // Step 4: Poll for deployment status
        console.log('⏳ Waiting for deployment to complete...');
        let status = deployment.readyState;
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes max

        while ((status === 'BUILDING' || status === 'QUEUED') && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            const updated = await vercel.deployments.getDeployment({
                idOrUrl: deployment.id,
                ...(config.teamId && { teamId: config.teamId }),
            });
            status = updated.readyState;
            attempts++;
            console.log(`   Status: ${status} (${attempts * 5}s)`);
        }

        if (status === 'READY') {
            console.log('\n🎉 Deployment successful!');
            console.log(`🌐 Your app is live at: https://${deployment.url}`);
            return deployment;
        } else if (status === 'ERROR') {
            console.error('\n❌ Deployment failed');
            throw new Error('Deployment failed with status: ERROR');
        } else {
            console.warn(`\n⚠️ Deployment status: ${status}`);
            console.log(`Check status at: ${deployment.inspectorUrl}`);
        }

    } catch (error) {
        if (error instanceof Error) {
            console.error(`\n❌ Deployment error: ${error.message}`);
        } else {
            console.error(`\n❌ Unknown error:`, error);
        }
        throw error;
    }
}

// Main execution
async function main() {
    // Configuration
    const config: DeploymentConfig = {
        projectName: 'voice-pdf-agent',
        repoOwner: 'DuncAIcode',
        repoName: 'voice-pdf-agent',
        // teamId: 'team_xxx', // Optional: Add if deploying to a team
        backendUrl: process.env.BACKEND_URL || 'https://your-backend.railway.app',
    };

    // Validate VERCEL_TOKEN
    if (!process.env.VERCEL_TOKEN) {
        console.error('❌ Error: VERCEL_TOKEN environment variable is required');
        console.log('\nTo get your token:');
        console.log('1. Go to https://vercel.com/account/tokens');
        console.log('2. Create a new token');
        console.log('3. Set it: export VERCEL_TOKEN=your-token-here\n');
        process.exit(1);
    }

    // Validate BACKEND_URL
    if (!process.env.BACKEND_URL || config.backendUrl.includes('your-backend')) {
        console.warn('⚠️  Warning: Using placeholder backend URL');
        console.log('Set BACKEND_URL environment variable to your actual backend URL\n');
    }

    try {
        await deployToVercel(config);
    } catch (error) {
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

export { deployToVercel, DeploymentConfig };

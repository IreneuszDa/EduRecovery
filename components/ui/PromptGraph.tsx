import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Scatter, Bubble } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';
import styles from './PromptGraph.module.css';

// Register the required chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Data generation functions
const generateLinearData = (m: number, b: number, start: number, end: number, points: number): number[][] => {
    const step = (end - start) / (points - 1);
    return Array.from({ length: points }, (_, i) => {
        const x = start + step * i;
        const y = m * x + b;
        return [x, y];
    });
};

const generateQuadraticData = (a: number, b: number, c: number, start: number, end: number, points: number): number[][] => {
    const step = (end - start) / (points - 1);
    return Array.from({ length: points }, (_, i) => {
        const x = start + step * i;
        const y = a * x * x + b * x + c;
        return [x, y];
    });
};

const generateExponentialData = (a: number, b: number, start: number, end: number, points: number): number[][] => {
    const step = (end - start) / (points - 1);
    return Array.from({ length: points }, (_, i) => {
        const x = start + step * i;
        const y = a * Math.exp(b * x);
        return [x, y];
    });
};

const generateSineData = (amplitude: number, frequency: number, phase: number, start: number, end: number, points: number): number[][] => {
    const step = (end - start) / (points - 1);
    return Array.from({ length: points }, (_, i) => {
        const x = start + step * i;
        const y = amplitude * Math.sin(frequency * x + phase);
        return [x, y];
    });
};

const generateNormalDistribution = (mean: number, stdDev: number, points: number): number[][] => {
    const data: number[][] = [];
    const step = 6 * stdDev / points;

    for (let i = 0; i < points; i++) {
        const x = mean - 3 * stdDev + step * i;
        const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
            Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
        data.push([x, y]);
    }

    return data;
};

// Types of graphs
type GraphType = 'line' | 'bar' | 'pie' | 'scatter' | 'bubble';

// Graph function types
type FunctionType = 'linear' | 'quadratic' | 'exponential' | 'sine' | 'normal' | 'custom';

// Graph data structure
interface GraphData {
    type: GraphType;
    functionType?: FunctionType;
    data: ChartData<any>;
    options: ChartOptions<any>;
}

// Props interface
interface PromptGraphProps {
    prompt: string;
    width?: string | number;
    height?: string | number;
    className?: string;
    onError?: (error: string) => void;
}

// Natural language parsing functions
const parseFunctionType = (prompt: string): FunctionType => {
    const prompt_lower = prompt.toLowerCase();

    if (prompt_lower.includes('linear') || prompt_lower.includes('straight line') || prompt_lower.includes('mx+b')) {
        return 'linear';
    } else if (prompt_lower.includes('quadratic') || prompt_lower.includes('parabola') || prompt_lower.includes('x^2') || prompt_lower.includes('ax²')) {
        return 'quadratic';
    } else if (prompt_lower.includes('exponential') || prompt_lower.includes('growth') || prompt_lower.includes('e^x')) {
        return 'exponential';
    } else if (prompt_lower.includes('sine') || prompt_lower.includes('cosine') || prompt_lower.includes('sin') || prompt_lower.includes('cos') || prompt_lower.includes('wave') || prompt_lower.includes('periodic')) {
        return 'sine';
    } else if (prompt_lower.includes('normal') || prompt_lower.includes('gaussian') || prompt_lower.includes('bell curve') || prompt_lower.includes('distribution')) {
        return 'normal';
    }

    return 'custom';
};

const parseGraphType = (prompt: string): GraphType => {
    const prompt_lower = prompt.toLowerCase();

    if (prompt_lower.includes('bar chart') || prompt_lower.includes('bar graph')) {
        return 'bar';
    } else if (prompt_lower.includes('pie chart') || prompt_lower.includes('pie graph') || prompt_lower.includes('circle graph')) {
        return 'pie';
    } else if (prompt_lower.includes('scatter') || prompt_lower.includes('points')) {
        return 'scatter';
    } else if (prompt_lower.includes('bubble')) {
        return 'bubble';
    }

    // Default to line graph
    return 'line';
};

const parseParameters = (prompt: string, functionType: FunctionType): any => {
    const prompt_lower = prompt.toLowerCase();
    let params: any = {};

    // Extract x-range if specified
    const rangeRegex = /range\s*\(?([+-]?\d+\.?\d*)\s*,\s*([+-]?\d+\.?\d*)\)?/;
    const rangeMatch = prompt_lower.match(rangeRegex);

    if (rangeMatch) {
        params.start = parseFloat(rangeMatch[1]);
        params.end = parseFloat(rangeMatch[2]);
    } else {
        // Default range
        params.start = -10;
        params.end = 10;
    }

    // Default number of points
    params.points = 100;

    // Extract specific function parameters based on function type
    switch (functionType) {
        case 'linear':
            // Look for slope and y-intercept (y = mx + b)
            const linearRegex = /y\s*=\s*([+-]?\d+\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)?/;
            const linearMatch = prompt_lower.match(linearRegex);

            if (linearMatch) {
                params.m = parseFloat(linearMatch[1]);
                params.b = linearMatch[2] ? parseFloat(linearMatch[2].replace(/\s/g, '')) : 0;
            } else {
                // Default linear function: y = x
                params.m = 1;
                params.b = 0;
            }
            break;

        case 'quadratic':
            // Look for coefficients (y = ax² + bx + c)
            const quadRegex = /y\s*=\s*([+-]?\d+\.?\d*)\s*x\^2\s*([+-]\s*\d+\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)?/;
            const quadMatch = prompt_lower.match(quadRegex);

            if (quadMatch) {
                params.a = parseFloat(quadMatch[1]);
                params.b = quadMatch[2] ? parseFloat(quadMatch[2].replace(/\s/g, '')) : 0;
                params.c = quadMatch[3] ? parseFloat(quadMatch[3].replace(/\s/g, '')) : 0;
            } else {
                // Default quadratic function: y = x²
                params.a = 1;
                params.b = 0;
                params.c = 0;
            }
            break;

        case 'exponential':
            // Look for coefficients (y = a*e^(bx))
            const expRegex = /y\s*=\s*([+-]?\d+\.?\d*)\s*e\^?\(?([+-]?\d+\.?\d*)\s*x\)?/;
            const expMatch = prompt_lower.match(expRegex);

            if (expMatch) {
                params.a = parseFloat(expMatch[1]);
                params.b = parseFloat(expMatch[2]);
            } else {
                // Default exponential function: y = e^x
                params.a = 1;
                params.b = 1;
            }
            break;

        case 'sine':
            // Look for amplitude, frequency, phase (y = a*sin(bx + c))
            const sineRegex = /y\s*=\s*([+-]?\d+\.?\d*)\s*sin\(?([+-]?\d+\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)?\)?/;
            const sineMatch = prompt_lower.match(sineRegex);

            if (sineMatch) {
                params.amplitude = parseFloat(sineMatch[1]);
                params.frequency = parseFloat(sineMatch[2]);
                params.phase = sineMatch[3] ? parseFloat(sineMatch[3].replace(/\s/g, '')) : 0;
            } else {
                // Default sine function: y = sin(x)
                params.amplitude = 1;
                params.frequency = 1;
                params.phase = 0;
            }
            break;

        case 'normal':
            // Look for mean and standard deviation
            const normalRegex = /mean\s*=?\s*([+-]?\d+\.?\d*)\s*(?:and|,)?\s*(?:std|standard deviation|sd)\s*=?\s*([+-]?\d+\.?\d*)/;
            const normalMatch = prompt_lower.match(normalRegex);

            if (normalMatch) {
                params.mean = parseFloat(normalMatch[1]);
                params.stdDev = parseFloat(normalMatch[2]);
            } else {
                // Default normal distribution: mean=0, stdDev=1
                params.mean = 0;
                params.stdDev = 1;
            }
            break;
    }

    return params;
};

const generateGraphData = (prompt: string): GraphData | null => {
    try {
        // Parse graph properties from the prompt
        const functionType = parseFunctionType(prompt);
        const graphType = parseGraphType(prompt);
        const parameters = parseParameters(prompt, functionType);

        // Extract title and labels if present
        const titleRegex = /title[:\s]+["']?([^"']+)["']?/i;
        const titleMatch = prompt.match(titleRegex);
        const title = titleMatch ? titleMatch[1] : 'Graph';

        const xLabelRegex = /x(?:-|\s)?(?:axis|label)[:\s]+["']?([^"']+)["']?/i;
        const xLabelMatch = prompt.match(xLabelRegex);
        const xLabel = xLabelMatch ? xLabelMatch[1] : 'X';

        const yLabelRegex = /y(?:-|\s)?(?:axis|label)[:\s]+["']?([^"']+)["']?/i;
        const yLabelMatch = prompt.match(yLabelRegex);
        const yLabel = yLabelMatch ? yLabelMatch[1] : 'Y';

        // Generate the appropriate data based on function type
        let rawData: number[][];
        switch (functionType) {
            case 'linear':
                rawData = generateLinearData(parameters.m, parameters.b, parameters.start, parameters.end, parameters.points);
                break;
            case 'quadratic':
                rawData = generateQuadraticData(parameters.a, parameters.b, parameters.c, parameters.start, parameters.end, parameters.points);
                break;
            case 'exponential':
                rawData = generateExponentialData(parameters.a, parameters.b, parameters.start, parameters.end, parameters.points);
                break;
            case 'sine':
                rawData = generateSineData(parameters.amplitude, parameters.frequency, parameters.phase, parameters.start, parameters.end, parameters.points);
                break;
            case 'normal':
                rawData = generateNormalDistribution(parameters.mean, parameters.stdDev, parameters.points);
                break;
            default:
                // Default to linear function if no specific type is detected
                rawData = generateLinearData(1, 0, parameters.start, parameters.end, parameters.points);
        }

        // Format the data for the chart library based on graph type
        let formattedData: ChartData<any>;

        if (graphType === 'line' || graphType === 'scatter') {
            formattedData = {
                labels: rawData.map(point => point[0].toFixed(1)),
                datasets: [
                    {
                        label: title,
                        data: rawData.map(point => point[1]),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        pointRadius: graphType === 'scatter' ? 4 : 0,
                        pointHoverRadius: 8,
                        tension: 0.1,
                    },
                ],
            };
        } else if (graphType === 'bar') {
            // For bar chart, use fewer data points to make it readable
            const sampledData = rawData.filter((_, i) => i % 10 === 0);
            formattedData = {
                labels: sampledData.map(point => point[0].toFixed(1)),
                datasets: [
                    {
                        label: title,
                        data: sampledData.map(point => point[1]),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            };
        } else if (graphType === 'pie') {
            // For pie chart, generate some categorical data
            const categories = ['Category A', 'Category B', 'Category C', 'Category D'];
            const values = [
                Math.abs(parameters.a || 1) * 10,
                Math.abs(parameters.b || 2) * 8,
                Math.abs(parameters.c || 3) * 6,
                Math.abs((parameters.m || parameters.amplitude || 4) * 5),
            ];

            formattedData = {
                labels: categories,
                datasets: [
                    {
                        label: title,
                        data: values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };
        } else { // bubble
            formattedData = {
                datasets: [
                    {
                        label: title,
                        data: rawData.filter((_, i) => i % 5 === 0).map(point => ({
                            x: point[0],
                            y: point[1],
                            r: Math.abs(point[1]) * 2 + 5, // Size based on y-value
                        })),
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    },
                ],
            };
        }

        // Common chart options
        const options: ChartOptions<any> = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16,
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
        };

        // Add scales for cartesian charts (not pie)
        if (graphType !== 'pie') {
            options.scales = {
                x: {
                    title: {
                        display: true,
                        text: xLabel,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: yLabel,
                    },
                },
            };
        }

        return {
            type: graphType,
            functionType,
            data: formattedData,
            options,
        };
    } catch (error) {
        console.error('Error generating graph data:', error);
        return null;
    }
};

const PromptGraph: React.FC<PromptGraphProps> = ({
    prompt,
    width = '100%',
    height = 400,
    className = '',
    onError,
}) => {
    const [graphData, setGraphData] = useState<GraphData | null>(null);

    useEffect(() => {
        try {
            const data = generateGraphData(prompt);
            setGraphData(data);
            if (!data && onError) {
                onError('Could not generate graph from the provided prompt');
            }
        } catch (error) {
            console.error('Error in PromptGraph:', error);
            if (onError) {
                onError('An error occurred while generating the graph');
            }
        }
    }, [prompt, onError]);

    if (!graphData) {
        return <div className={`prompt-graph-error ${className}`}>Could not generate graph from the prompt</div>;
    }

    const chartStyle = {
        width,
        height,
    };

    // Render the appropriate chart component based on the graph type
    switch (graphData.type) {
        case 'line':
            return <Line data={graphData.data} options={graphData.options} style={chartStyle} className={`prompt-graph ${className}`} />;
        case 'bar':
            return <Bar data={graphData.data} options={graphData.options} style={chartStyle} className={`prompt-graph ${className}`} />;
        case 'pie':
            return <Pie data={graphData.data} options={graphData.options} style={chartStyle} className={`prompt-graph ${className}`} />;
        case 'scatter':
            return <Scatter data={graphData.data} options={graphData.options} style={chartStyle} className={`prompt-graph ${className}`} />;
        case 'bubble':
            return <Bubble data={graphData.data} options={graphData.options} style={chartStyle} className={`prompt-graph ${className}`} />;
        default:
            return <Line data={graphData.data} options={graphData.options} style={chartStyle} className={`prompt-graph ${className}`} />;
    }
};

export default PromptGraph;

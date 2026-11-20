import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from './App';
import { AQIOverviewCard } from './components/AQIOverviewCard';
import { FamilyProfileCustomizer } from './components/FamilyProfileCustomizer';
import { ActionCardsSection } from './components/ActionCardsSection';
import { ImpactDashboard } from './components/ImpactDashboard';
import { GenAIAssistant } from './components/GenAIAssistant';
import { CITIES_DATA, INITIAL_SUSTAINABLE_ACTIONS } from './mockData';
import { FamilyProfile } from './types';

// Mock Leaflet as it requires browser canvas/DOM APIs not in basic jsdom
vi.mock('leaflet', () => ({
  default: {
    map: () => ({
      setView: vi.fn(),
      addTo: vi.fn(),
      remove: vi.fn(),
    }),
    tileLayer: () => ({
      addTo: vi.fn(),
    }),
    layerGroup: () => ({
      addTo: vi.fn(),
      clearLayers: vi.fn(),
    }),
    circle: () => ({
      bindTooltip: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      addTo: vi.fn(),
    }),
    divIcon: () => ({}),
    marker: () => ({
      on: vi.fn().mockReturnThis(),
      addTo: vi.fn(),
    }),
  },
}));

describe('Feature 1: AQI & Weather Overview Card', () => {
  it('renders city AQI, primary pollutant, and thermal inversion advisory', () => {
    const mockData = CITIES_DATA['delhi-ncr'];
    render(
      <AQIOverviewCard
        data={mockData}
        selectedCityKey="delhi-ncr"
        onCityChange={vi.fn()}
      />
    );

    expect(screen.getByText('388')).toBeInTheDocument();
    expect(screen.getByText('Severe Smog / Hazardous')).toBeInTheDocument();
    expect(screen.getByText(/Thermal Inversion Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Fine Combustion Particles/i)).toBeInTheDocument();
  });

  it('triggers city change callback when dropdown selection changes', () => {
    const onCityChange = vi.fn();
    render(
      <AQIOverviewCard
        data={CITIES_DATA['delhi-ncr']}
        selectedCityKey="delhi-ncr"
        onCityChange={onCityChange}
      />
    );

    const select = screen.getByLabelText(/select urban location for air quality index/i);
    fireEvent.change(select, { target: { value: 'mumbai' } });
    expect(onCityChange).toHaveBeenCalledWith('mumbai');
  });
});

describe('Feature 2: Household Profile Customizer', () => {
  it('toggles vulnerability filters and triggers state updates', () => {
    const profile: FamilyProfile = {
      name: 'Test Household',
      membersCount: 4,
      hasChildren: false,
      hasElderly: false,
      hasAsthmaOrRespiratory: false,
      commuteType: 'car',
      livingType: 'apartment',
      heatingType: 'natural_gas',
      airPurifierAvailable: false,
    };

    const onChange = vi.fn();
    render(<FamilyProfileCustomizer profile={profile} onChange={onChange} />);

    const childrenButton = screen.getByRole('button', { name: /children \/ infants/i });
    fireEvent.click(childrenButton);

    expect(onChange).toHaveBeenCalledWith({
      ...profile,
      hasChildren: true,
    });
  });

  it('allows changing winter heating type', () => {
    const profile: FamilyProfile = {
      name: 'Test Household',
      membersCount: 4,
      hasChildren: false,
      hasElderly: false,
      hasAsthmaOrRespiratory: false,
      commuteType: 'car',
      livingType: 'apartment',
      heatingType: 'natural_gas',
      airPurifierAvailable: false,
    };

    const onChange = vi.fn();
    render(<FamilyProfileCustomizer profile={profile} onChange={onChange} />);

    const select = screen.getByLabelText(/winter heating method/i);
    fireEvent.change(select, { target: { value: 'wood_coal' } });

    expect(onChange).toHaveBeenCalledWith({
      ...profile,
      heatingType: 'wood_coal',
    });
  });
});

describe('Feature 3: Action Cards & DIY Hacks Section', () => {
  it('renders actions and filters by category', () => {
    const onFilterChange = vi.fn();
    render(
      <ActionCardsSection
        actions={INITIAL_SUSTAINABLE_ACTIONS}
        onToggleAction={vi.fn()}
        activeFilter="all"
        onFilterChange={onFilterChange}
      />
    );

    expect(screen.getByText('DIY Corsi-Rosenthal Cube Air Purifier')).toBeInTheDocument();
    expect(screen.getByText('Wet-Towel Draft & Gap Barrier')).toBeInTheDocument();

    const indoorFilterBtn = screen.getByRole('button', { name: 'Indoor Hacks' });
    fireEvent.click(indoorFilterBtn);
    expect(onFilterChange).toHaveBeenCalledWith('indoor_hack');
  });

  it('toggles an action when clicking Adopt Action button', () => {
    const onToggle = vi.fn();
    render(
      <ActionCardsSection
        actions={INITIAL_SUSTAINABLE_ACTIONS}
        onToggleAction={onToggle}
        activeFilter="all"
        onFilterChange={vi.fn()}
      />
    );

    const adoptButtons = screen.getAllByRole('button', { name: /adopt action/i });
    fireEvent.click(adoptButtons[0]);
    expect(onToggle).toHaveBeenCalledWith(INITIAL_SUSTAINABLE_ACTIONS[0].id);
  });
});

describe('Feature 4: Impact Ledger Dashboard', () => {
  it('calculates PM2.5, CO2, and health equivalents for implemented actions', () => {
    const actions = [
      {
        ...INITIAL_SUSTAINABLE_ACTIONS[0],
        implemented: true, // 85g PM2.5, 14.5kg CO2
      },
      {
        ...INITIAL_SUSTAINABLE_ACTIONS[1],
        implemented: false,
      },
    ];

    render(<ImpactDashboard actions={actions} />);

    // Total grams offset: 85
    expect(screen.getByText('85')).toBeInTheDocument();
    // Total CO2 saved: 14.5
    expect(screen.getByText('14.5')).toBeInTheDocument();
  });
});

describe('Feature 5: GenAI Smog Assistant Interaction', () => {
  it('submits a user question and generates an advisory response', async () => {
    const mockData = CITIES_DATA['delhi-ncr'];
    const profile: FamilyProfile = {
      name: 'Test Household',
      membersCount: 4,
      hasChildren: true,
      hasElderly: false,
      hasAsthmaOrRespiratory: true,
      commuteType: 'car',
      livingType: 'apartment',
      heatingType: 'natural_gas',
      airPurifierAvailable: false,
    };

    render(
      <GenAIAssistant
        aqiData={mockData}
        profile={profile}
        onAddCustomAction={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/ask the urban air quality assistant/i);
    const sendBtn = screen.getByLabelText(/send message/i);

    fireEvent.change(input, { target: { value: 'How do I build a Corsi box?' } });
    fireEvent.click(sendBtn);

    expect(screen.getByText('How do I build a Corsi box?')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText(/A Corsi-Rosenthal \(C-R\) box delivers/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});

describe('Feature 6: End-to-End App Navigation & Integration', () => {
  it('switches between Overview & Actions, Area AQI Map, and GenAI tabs', () => {
    render(<App />);

    // Initially in Overview
    expect(screen.getByText(/Direct Impact & Emission Offset Ledger/i)).toBeInTheDocument();

    // Click Map Tab
    const mapTab = screen.getByRole('button', { name: /area aqi map/i });
    fireEvent.click(mapTab);
    expect(screen.getByText(/Urban Micro-Climate Stagnation/i)).toBeInTheDocument();

    // Click GenAI Tab
    const aiTab = screen.getByRole('button', { name: /genai smog advisor/i });
    fireEvent.click(aiTab);
    expect(screen.getByText(/AeroPulse GenAI Smog Advisor/i)).toBeInTheDocument();
  });
});

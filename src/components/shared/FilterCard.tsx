import {
    Button,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    ClickAwayListener,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grow,
    Grid,
    FormControlLabel,
    Checkbox,
    Chip,
    Divider
} from '@mui/material'
import React, { useState, useRef, useCallback } from 'react'
import {
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Download as DownloadIcon,
    RefreshOutlined as RefreshIcon,
    Close as CloseIcon,
    FilterAlt as FilterAltIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

// Tipos mejorados
type FieldOption = {
    name: string;
    value: string;
};

type Field = {
    active: boolean;
    name: string;
    type: 'text' | 'select' | 'date' | 'number';
    options?: FieldOption[];
    value?: string | number;
};

type Fields = Record<string, Field>;
type FilterValues = Record<string, string | number>;

interface FilterCardProps {
    onSearch?: (searchValue: string) => void;
    onFiltersChange?: (filters: FilterValues) => void;
    onClearFilters?: () => void;
    onRefresh?: () => void;
    onExport?: () => void;
    loading?: boolean;
    path: string;
    fieldsProp: Fields;
    btnName: string;
}

export const FilterCard: React.FC<FilterCardProps> = ({
    onSearch,
    onFiltersChange,
    onClearFilters,
    onRefresh,
    onExport,
    loading = false,
    path,
    fieldsProp,
    btnName
}) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isFieldsOpen, setIsFieldsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [fields, setFields] = useState<Fields>(fieldsProp);
    const getActiveFiltersWithValues = useCallback(() => {
        return Object.entries(fields)
            .filter(([_, field]) => field.active && field.value && field.value !== '')
            .reduce((acc, [key, field]) => {
                acc[key] = field.value!;
                return acc;
            }, {} as FilterValues);
    }, [fields]);
    const handleFieldValueChange = (fieldKey: string, value: string | number) => {
        setFields(prev => ({
            ...prev,
            [fieldKey]: {
                ...prev[fieldKey],
                value
            }
        }));
    };

    const toggleField = (key: string) => {
        setFields(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                active: !prev[key].active,
                value: !prev[key].active ? prev[key].value : ""
            }
        }));
    };

    // Aplicar filtros
    const applyFilters = () => {
        const activeFilters = getActiveFiltersWithValues();
        setAppliedFilters(activeFilters);
        onFiltersChange?.(activeFilters);
        setIsFiltersOpen(false);
    };

    const clearAllFilters = () => {
        setFields(prev => {
            const cleared = { ...prev };
            Object.keys(cleared).forEach(key => {
                cleared[key] = { ...cleared[key], value: "" };
            });
            return cleared;
        });
        setSearchValue('');
        setAppliedFilters({});
        onClearFilters?.();
    };

    const removeFilter = (filterKey: string) => {
        setFields(prev => ({
            ...prev,
            [filterKey]: {
                ...prev[filterKey],
                value: ""
            }
        }));
        const newFilters = { ...appliedFilters };
        delete newFilters[filterKey];
        setAppliedFilters(newFilters);
        onFiltersChange?.(newFilters);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch?.(value);
    };

    const handleSearchClick = () => {
        setIsFiltersOpen(!isFiltersOpen);
    };

    const handleClose = () => {
        setIsFiltersOpen(false);
    };

    const handleCloseFields = () => {
        setIsFieldsOpen(false);
    };

    // Contar filtros activos
    const activeFiltersCount = Object.keys(appliedFilters).length;

    // Renderizar campo según su tipo
    const renderFilterField = (key: string, field: Field) => {
        const commonProps = {
            size: "small" as const,
            fullWidth: true,
            value: field.value || "",
        };

        switch (field.type) {
            case 'select':
                return (
                    <FormControl {...commonProps}>
                        <InputLabel>{field.name}</InputLabel>
                        <Select
                            value={field.value || ""}
                            onChange={(e) => handleFieldValueChange(key, e.target.value)}
                            label={field.name}
                        >
                            <MenuItem value="">
                                <em>Todos</em>
                            </MenuItem>
                            {field.options?.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );

            case 'date':
                return (
                    <TextField
                        {...commonProps}
                        label={field.name}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => handleFieldValueChange(key, e.target.value)}
                    />
                );

            case 'number':
                return (
                    <TextField
                        {...commonProps}
                        label={field.name}
                        type="number"
                        onChange={(e) => handleFieldValueChange(key, Number(e.target.value) || "")}
                    />
                );

            default: // text
                return (
                    <TextField
                        {...commonProps}
                        label={field.name}
                        onChange={(e) => handleFieldValueChange(key, e.target.value)}
                    />
                );
        }
    };

    return (
        <Paper sx={{ mb: 2, position: 'relative' }} ref={containerRef}>
            <Toolbar sx={{ px: 2, py: 2 }}>
                <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                    <TextField
                        value={searchValue}
                        onChange={handleSearchChange}
                        onClick={handleSearchClick}
                        placeholder="Filtrar y buscar..."
                        variant="outlined"
                        size="small"
                        sx={{
                            minWidth: isFiltersOpen ? '62%' : '300px',
                            transition: 'min-width 0.3s ease',
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {activeFiltersCount > 0 && (
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                            {Object.entries(appliedFilters).map(([key, value]) => {
                                const field = fields[key];
                                if (!field) return null;

                                let displayValue = String(value);
                                if (field.type === 'select' && field.options) {
                                    const option = field.options.find(opt => opt.value === value);
                                    displayValue = option ? option.name : displayValue;
                                }

                                return (
                                    <Chip
                                        key={key}
                                        label={`${field.name}: ${displayValue}`}
                                        size="small"
                                        onDelete={() => removeFilter(key)}
                                        color="primary"
                                        variant="outlined"
                                    />
                                );
                            })}
                        </Stack>
                    )}
                </Stack>

                <Stack direction="row" spacing={1}>
                    <Tooltip title="Filtros">
                        <IconButton
                            size="small"
                            onClick={handleSearchClick}
                            color={activeFiltersCount > 0 ? "primary" : "default"}
                        >
                            <FilterAltIcon />
                            {activeFiltersCount > 0 && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -2,
                                        right: -2,
                                        bgcolor: 'error.main',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 16,
                                        height: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.7rem'
                                    }}
                                >
                                    {activeFiltersCount}
                                </Box>
                            )}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Limpiar filtros">
                        <IconButton
                            size="small"
                            onClick={clearAllFilters}
                            disabled={activeFiltersCount === 0 && searchValue === ''}
                        >
                            <FilterIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Actualizar">
                        <IconButton
                            size="small"
                            onClick={onRefresh}
                            disabled={loading}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Exportar">
                        <IconButton
                            size="small"
                            onClick={onExport}
                            disabled={loading}
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        size="small"
                        onClick={() => navigate(path)}
                        disabled={loading}
                    >
                        {btnName}
                    </Button>
                </Stack>
            </Toolbar>

            {isFiltersOpen && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: '51%',
                        zIndex: 1000,
                        mt: 1
                    }}
                >
                    <ClickAwayListener
                        onClickAway={handleClose}
                        mouseEvent="onMouseDown"
                        touchEvent="onTouchStart"
                    >
                        <Grow in={isFiltersOpen} timeout={200}>
                            <Paper
                                elevation={12}
                                sx={{
                                    p: 3,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2,
                                    backgroundColor: 'background.paper',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                    minWidth: '350px'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" component="h3" color="primary">
                                        Filtros Avanzados
                                    </Typography>
                                    <IconButton size="small" onClick={handleClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                {/* Campos activos - en dos columnas */}
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    {Object.entries(fields)
                                        .filter(([_, field]) => field.active)
                                        .map(([key, field]) => (
                                            <Grid size={{ xs: 12, md: 6 }} key={key}>
                                                <Stack
                                                    direction="row"
                                                    spacing={0}
                                                    sx={{
                                                        alignItems: 'center',
                                                        "&:hover .close-btn": { opacity: 1 },
                                                    }}
                                                >
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        {renderFilterField(key, field)}
                                                    </Box>
                                                    <IconButton
                                                        className="close-btn"
                                                        onClick={() => toggleField(key)}
                                                        sx={{
                                                            opacity: 0,
                                                            backgroundColor: "transparent",
                                                            border: "none",
                                                            transition: "opacity 0.3s ease",
                                                            "&:hover": {
                                                                backgroundColor: "transparent"
                                                            }
                                                        }}
                                                    >
                                                        <CloseIcon sx={{ fontSize: '16px' }} />
                                                    </IconButton>
                                                </Stack>
                                            </Grid>
                                        ))
                                    }
                                </Grid>

                                {/* Botón para agregar campos */}
                                <Button
                                    onClick={() => setIsFieldsOpen(true)}
                                    variant="text"
                                    color="primary"
                                    sx={{ mb: 2 }}
                                >
                                    + Agregar campo
                                </Button>

                                <Divider sx={{ my: 2 }} />

                                {/* Botones de acción */}
                                <Stack direction="row" spacing={2} justifyContent="flex-end">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={clearAllFilters}
                                    >
                                        Limpiar Todo
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={applyFilters}
                                    >
                                        Aplicar Filtros
                                    </Button>
                                </Stack>

                                {/* Modal de selección de campos */}
                                {isFieldsOpen && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '70%',
                                            left: 10,
                                            right: 10,
                                            zIndex: 1400,
                                            mt: 1
                                        }}
                                    >
                                        <ClickAwayListener
                                            onClickAway={handleCloseFields}
                                            mouseEvent="onMouseDown"
                                            touchEvent="onTouchStart"
                                        >
                                            <Grow in={isFieldsOpen} timeout={200}>
                                                <Paper
                                                    elevation={16}
                                                    sx={{
                                                        p: 3,
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: 2,
                                                        backgroundColor: 'background.paper',
                                                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                        <Typography variant="subtitle1" color="primary">
                                                            Seleccionar campos
                                                        </Typography>
                                                        <IconButton size="small" onClick={handleCloseFields}>
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Box>

                                                    <Grid container spacing={1}>
                                                        {Object.entries(fields).map(([key, field]) => (
                                                            <Grid size={{ xs: 12, md: 3, sm: 6 }} key={key}>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            onChange={() => toggleField(key)}
                                                                            checked={field.active}
                                                                            color="primary"
                                                                        />
                                                                    }
                                                                    sx={{
                                                                        "& .MuiFormControlLabel-label": {
                                                                            fontSize: "0.875rem"
                                                                        }
                                                                    }}
                                                                    label={field.name}
                                                                />
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Paper>
                                            </Grow>
                                        </ClickAwayListener>
                                    </Box>
                                )}
                            </Paper>
                        </Grow>
                    </ClickAwayListener>
                </Box>
            )}
        </Paper>
    );
};
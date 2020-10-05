import setuptools

if __name__ == '__main__':
    with open("README.md", "r") as fh:
        long_description = fh.read()

    setuptools.setup(
        name="polzybackend",
        version="0.0.1",
        author="Bernhard Buhl",
        author_email="buhl@buhl-consulting.com.cy",
        description="Open source Insurance Policy life cycle management",
        long_description=long_description,
        long_description_content_type="text/markdown",
        url="https://baangt.org",
        packages=setuptools.find_packages(),
        data_files=[],
        package_data={},
        install_requires=["Flask", "SQLAlchemy", "Werkzeug", "Flask-SQLAlchemy", "Jinja2"],
        classifiers=[
            "Programming Language :: Python :: 3",
            "License :: OSI Approved :: MIT License",
            "Operating System :: OS Independent",
        ],
        include_package_data=True,
        python_requires='>=3.6',
    )
